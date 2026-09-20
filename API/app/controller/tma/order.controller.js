const EMenuModel = require('../../models/emenu.model');

const OrderController = {
  async createOrder(req, res) {
    try {
      const { slug } = req.params;
      const { items, note } = req.body;
      const tgUser = req.telegramUser;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ status: false, message: 'Order must contain at least one item' });
      }

      const store = await EMenuModel.getStoreBySlug(slug);
      if (!store) return res.status(404).json({ status: false, message: 'Store not found' });

      // Fallback guest user ID if running directly from browser outside TG
      let customerId = 1;
      if (tgUser && tgUser.id) {
        customerId = await EMenuModel.getOrCreateCustomer(store.id, tgUser);
      }

      const orderResult = await EMenuModel.createStoreOrder(store, customerId, items, note);
      res.status(201).json({ status: true, message: 'Order submitted successfully', data: orderResult });
    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  }
};

module.exports = OrderController;