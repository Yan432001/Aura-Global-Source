const EMenuModel = require('../../models/emenu.model');
const { sendOrderToShopGroup } = require('../../services/telegramNotification.service');

// In-memory store for past orders (accessible via /api/tma/orders)
const orderHistory = [
  {
    id: 101,
    referenceNo: "TMA-1790233443882",
    store_name: "Aura Specialty Coffee",
    store_slug: "sbc-store",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    status: "confirmed",
    payment_status: "paid",
    customer: {
      name: "Elena Rostova",
      phone: "+855 12 888 777",
      address: "Table #04 (Dine-In)",
      note: "Extra napkins & oat milk please"
    },
    items: [
      { id: 1, name: "Spanish Iced Latte", quantity: 2, price: 4.25, subtotal: 8.50 },
      { id: 5, name: "Golden Almond Croissant", quantity: 1, price: 3.75, subtotal: 3.75 }
    ],
    grandTotal: 12.25
  },
  {
    id: 102,
    referenceNo: "TMA-1790198234120",
    store_name: "Aura Artisan Bakery",
    store_slug: "aura-bakery",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    status: "completed",
    payment_status: "paid",
    customer: {
      name: "Guest Customer",
      phone: "+855 77 123 456",
      address: "Takeaway Counter",
      note: "Pack separately please"
    },
    items: [
      { id: 6, name: "Classic French Pain au Chocolat", quantity: 2, price: 3.50, subtotal: 7.00 },
      { id: 7, name: "Country Sourdough Loaf (800g)", quantity: 1, price: 5.50, subtotal: 5.50 }
    ],
    grandTotal: 12.50
  }
];

const OrderController = {
  async getOrders(req, res) {
    try {
      const { storeSlug, status } = req.query;
      let list = [...orderHistory];
      if (storeSlug) {
        list = list.filter(
          (o) => !o.store_slug || o.store_slug.toLowerCase() === String(storeSlug).toLowerCase()
        );
      }
      if (status) {
        list = list.filter((o) => o.status === status);
      }
      return res.status(200).json({
        status: true,
        data: list,
        orders: list,
        count: list.length
      });
    } catch (err) {
      return res.status(500).json({ status: false, error: err.message });
    }
  },

  async createOrder(req, res) {
    try {
      const { slug } = req.params;
      const { items, note, customer: incomingCustomer = {} } = req.body;
      const tgUser = req.telegramUser;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ status: false, message: 'Order must contain at least one item' });
      }

      const store =
        (slug ? await EMenuModel.getStoreBySlug(slug) : null) ||
        (await EMenuModel.getStoreByIdentifier(req.body.storeSlug || 1));
      if (!store) return res.status(404).json({ status: false, message: 'Store not found' });

      // Fallback guest user ID if running directly from browser outside TG
      let customerId = 1;
      if (tgUser && tgUser.id) {
        customerId = await EMenuModel.getOrCreateCustomer(store.id, tgUser);
      }

      const orderResult = await EMenuModel.createStoreOrder(store, customerId, items, note);

      const customerPayload = {
        name: incomingCustomer.name || tgUser?.first_name || 'Telegram Guest',
        phone: incomingCustomer.phone || '',
        address: incomingCustomer.address || '',
        note: note || incomingCustomer.note || ''
      };

      // Dispatch to Telegram Shop Group
      const dispatchInfo = await sendOrderToShopGroup({
        store,
        order: orderResult,
        customer: customerPayload,
        items
      });

      // Record in order history
      const newOrderRecord = {
        id: orderResult.saleId || Date.now(),
        referenceNo: orderResult.referenceNo || `TMA-${Date.now()}`,
        store_name: store.name || store.company || 'Aura Store',
        store_slug: store.slug || req.body.storeSlug || slug || 'sbc-store',
        createdAt: new Date().toISOString(),
        status: 'pending',
        payment_status: 'pending',
        customer: customerPayload,
        items: items.map((it) => ({
          id: it.id || it.productId,
          name: it.name,
          quantity: it.quantity,
          price: it.price,
          subtotal: Number(it.price) * Number(it.quantity)
        })),
        grandTotal:
          orderResult.grandTotal ||
          items.reduce((s, it) => s + Number(it.price) * Number(it.quantity), 0),
        dispatchInfo
      };
      orderHistory.unshift(newOrderRecord);

      res.status(201).json({
        status: true,
        message: 'Order submitted successfully and dispatched to shop group',
        referenceNo: newOrderRecord.referenceNo,
        data: {
          ...orderResult,
          dispatchInfo
        }
      });
    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  }
};

module.exports = OrderController;
