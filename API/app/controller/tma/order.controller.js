const db = require("../../config/utill/connection");
const { notifyStoreOwner } = require("../../services/telegramBot.service");

exports.createOrder = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { storeSlug, customer, items, tgUserId, cartId } = req.body;

    // 1. Resolve Biller/Store
    const [stores] = await connection.query(
      "SELECT id, name, company, telegram_chat_id FROM aura_companies WHERE store_slug = ? AND group_name = 'biller' LIMIT 1",
      [storeSlug]
    );

    if (stores.length === 0) {
      return res.status(404).json({ error: "Store not found" });
    }
    const store = stores[0];

    await connection.beginTransaction();

    // 2. Resolve items: Check aura_cart if cartId or user id is provided
    let orderItems = [];

    if (cartId || tgUserId) {
      const [cartRows] = await connection.query(
        `SELECT c.product_id, c.quantity, p.name, p.code, p.price 
         FROM aura_cart c
         JOIN aura_products p ON c.product_id = p.id
         WHERE c.cart_id = ? OR c.user_id = ?`,
        [cartId || null, tgUserId || null]
      );

      if (cartRows.length > 0) {
        orderItems = cartRows.map((row) => ({
          productId: row.product_id,
          code: row.code,
          name: row.name,
          price: row.price,
          quantity: row.quantity,
        }));
      }
    }

    // Fallback: If no cart records found, use items array passed in request body
    if (orderItems.length === 0 && Array.isArray(items) && items.length > 0) {
      orderItems = items;
    }

    if (orderItems.length === 0) {
      await connection.rollback();
      return res.status(400).json({ error: "No items in cart to checkout" });
    }

    // 3. Find or Create Customer
    let customerId;
    const [existingCust] = await connection.query(
      "SELECT id FROM aura_companies WHERE phone = ? AND group_name = 'customer' LIMIT 1",
      [customer.phone]
    );

    if (existingCust.length > 0) {
      customerId = existingCust[0].id;
    } else {
      const [newCust] = await connection.query(
        "INSERT INTO aura_companies (group_name, name, company, phone, address, customer_group_id, customer_group_name) VALUES ('customer', ?, ?, ?, ?, 1, 'General')",
        [customer.name, customer.name, customer.phone, customer.address]
      );
      customerId = newCust.insertId;
    }

    // 4. Calculate total & generate reference number
    const grandTotal = orderItems.reduce(
      (acc, curr) => acc + Number(curr.price) * Number(curr.quantity),
      0
    );
    const referenceNo = `ORD-${Date.now().toString().slice(-6)}`;

    // 5. Insert into aura_sales
    const [sale] = await connection.query(
      `INSERT INTO aura_sales 
        (date, reference_no, biller_id, biller, customer_id, customer, grand_total, total, sale_status, payment_status, note) 
       VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?, 'pending', 'due', ?)`,
      [
        referenceNo,
        store.id,
        store.company || store.name,
        customerId,
        customer.name,
        grandTotal,
        grandTotal,
        `Telegram Mini App | UserID: ${tgUserId || "N/A"}`,
      ]
    );

    const saleId = sale.insertId;

    // 6. Insert items into aura_sale_items
    for (const item of orderItems) {
      const subtotal = Number(item.price) * Number(item.quantity);
      await connection.query(
        `INSERT INTO aura_sale_items 
          (sale_id, product_id, product_code, product_name, net_unit_price, unit_price, quantity, subtotal, real_unit_price) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          saleId,
          item.productId,
          item.code || "SKU",
          item.name,
          item.price,
          item.price,
          item.quantity,
          subtotal,
          item.price,
        ]
      );
    }

    // 7. Clear the processed items from aura_cart
    if (cartId || tgUserId) {
      await connection.query(
        "DELETE FROM aura_cart WHERE cart_id = ? OR user_id = ?",
        [cartId || null, tgUserId || null]
      );
    }

    await connection.commit();

    // 8. Trigger Telegram Bot Alert
    await notifyStoreOwner(
      { name: store.company || store.name, telegramChatId: store.telegram_chat_id },
      {
        id: saleId,
        referenceNo,
        customerName: customer.name,
        customerPhone: customer.phone,
        shippingAddress: customer.address,
        totalAmount: grandTotal,
        items: orderItems.map((i) => ({
          productName: i.name,
          quantity: i.quantity,
          subtotal: Number(i.price) * Number(i.quantity),
        })),
      }
    );

    return res.status(201).json({ success: true, referenceNo, saleId });
  } catch (error) {
    await connection.rollback();
    console.error("Order Checkout Error:", error);
    return res.status(500).json({ error: "Failed to process order" });
  } finally {
    connection.release();
  }
};