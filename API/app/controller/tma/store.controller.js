const EMenuModel = require('../../models/emenu.model');

const StoreController = {
  async getStore(req, res) {
    try {
      const { slug } = req.params;
      const store = await EMenuModel.getStoreBySlug(slug);
      if (!store) return res.status(404).json({ status: false, message: 'Store not found' });
      const menu = await EMenuModel.getStoreMenu(store.id);
      res.json({
        status: true,
        data: store,
        store: {
          ...store,
          logoUrl: store.logo
        },
        products: menu.products || [],
        categories: menu.categories || []
      });
    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  },

  async resolveBiller(req, res) {
    try {
      const { id } = req.params;
      const store = await EMenuModel.getStoreByBillerId(id);
      if (!store || !store.slug) return res.status(404).json({ status: false, message: 'Biller or store mapping not found' });
      res.json({ status: true, slug: store.slug });
    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  },

  async getCategories(req, res) {
    try {
      const { slug } = req.params;
      const store = await EMenuModel.getStoreBySlug(slug);
      if (!store) return res.status(404).json({ status: false, message: 'Store not found' });

      const categories = await EMenuModel.getCategoriesByStore(store.id);
      res.json({ status: true, data: categories });
    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  },

  async getProducts(req, res) {
    try {
      const { slug } = req.params;
      const store = await EMenuModel.getStoreBySlug(slug);
      if (!store) return res.status(404).json({ status: false, message: 'Store not found' });

      const categoryId = req.query.category ? Number(req.query.category) : null;
      const query = req.query.q || '';
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 20));
      const offset = (page - 1) * limit;

      const result = await EMenuModel.getProductsByStore(store.id, { categoryId, query, offset, limit });
      res.json({
        status: true,
        data: result.rows,
        meta: {
          total: result.total,
          page,
          limit,
          totalPages: Math.ceil(result.total / limit)
        }
      });
    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  }
};

module.exports = StoreController;