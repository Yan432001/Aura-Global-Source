const db = require('../config/utill/connection');

const EMenuModel = {
  getStoreByIdentifier: async (identifier) => {
    // identifier can be biller_id or company slug/name
    const isNumeric = /^\d+$/.test(identifier);
    const sql = isNumeric 
      ? `SELECT c.id as biller_id, c.name, c.company, c.address, c.phone, c.email, 
                s.default_sale, s.default_sale_discount, s.default_sale_tax
         FROM aura_companies c
         LEFT JOIN aura_account_settings s ON s.biller_id = c.id
         WHERE c.id = ? AND c.group_name = 'biller' LIMIT 1`
      : `SELECT c.id as biller_id, c.name, c.company, c.address, c.phone, c.email,
                s.default_sale, s.default_sale_discount, s.default_sale_tax
         FROM aura_companies c
         LEFT JOIN aura_account_settings s ON s.biller_id = c.id
         WHERE (c.name = ? OR LOWER(REPLACE(c.company, ' ', '-')) = LOWER(?)) 
           AND c.group_name = 'biller' LIMIT 1`;

    const params = isNumeric ? [parseInt(identifier, 10)] : [identifier, identifier];
    const [rows] = await db.query(sql, params);
    return rows[0] || null;
  },

  getStoreMenu: async (billerId) => {
    const categoriesSql = `
      SELECT DISTINCT cat.id, cat.name, cat.code, cat.image
      FROM aura_categories cat
      JOIN aura_products p ON p.category_id = cat.id
      WHERE (p.biller_id = ? OR p.biller_id IS NULL OR p.biller_id = 0)
      ORDER BY cat.name ASC`;

    const productsSql = `
      SELECT p.id, p.code, p.name, p.price, p.unit, p.image, p.category_id, p.details
      FROM aura_products p
      WHERE (p.biller_id = ? OR p.biller_id IS NULL OR p.biller_id = 0)
      ORDER BY p.name ASC`;

    const [categories] = await db.query(categoriesSql, [billerId]);
    const [products] = await db.query(productsSql, [billerId]);

    return { categories, products };
  },

  createOrder: async (billerId, customerData, cartItems) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      let totalAmount = 0;
      cartItems.forEach(item => {
        totalAmount += Number(item.price) * Number(item.quantity);
      });

      const referenceNo = `ORD-${Date.now()}-${billerId}`;
      const saleDate = new Date();

      // 1. Insert into aura_sales
      const insertSaleSql = `
        INSERT INTO aura_sales (
          date, reference_no, biller_id, biller, customer_id, customer, 
          grand_total, total, sale_status, payment_status, note
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'completed', 'due', ?)`;

      const [saleResult] = await connection.query(insertSaleSql, [
        saleDate,
        referenceNo,
        billerId,
        customerData.storeName || 'Store Order',
        customerData.customerId || 1,
        customerData.customerName || 'Telegram User',
        totalAmount,
        totalAmount,
        `Telegram Order: ${customerData.telegramUsername || 'N/A'}`
      ]);

      const saleId = saleResult.insertId;

      // 2. Insert into aura_sale_items
      const insertItemsSql = `
        INSERT INTO aura_sale_items (
          sale_id, product_id, product_code, product_name, 
          net_unit_price, unit_price, quantity, subtotal
        ) VALUES ?`;

      const itemsData = cartItems.map(item => [
        saleId,
        item.id,
        item.code || '',
        item.name,
        item.price,
        item.price,
        item.quantity,
        Number(item.price) * Number(item.quantity)
      ]);

      await connection.query(insertItemsSql, [itemsData]);

      await connection.commit();
      return { saleId, referenceNo, totalAmount };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
};

module.exports = EMenuModel;