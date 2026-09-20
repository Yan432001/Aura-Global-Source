const express = require('express');
const router = express.Router();
const StoreController = require('../../controller/tma/store.controller');
const OrderController = require('../../controller/tma/order.controller');
const { verifyTelegramWebAppData } = require('../../middleware/telegramAuth.middleware');

// Public tenant read endpoints
router.get('/shop/:slug', StoreController.getStore);
router.get('/shop/:slug/categories', StoreController.getCategories);
router.get('/shop/:slug/products', StoreController.getProducts);
router.get('/biller/:id/store', StoreController.resolveBiller);

// Secure checkout (Permits conditional local testing or strict initData enforcement)
const authMiddleware = process.env.NODE_ENV === 'development'
  ? (req, res, next) => {
      if (req.headers['x-telegram-init-data']) return verifyTelegramWebAppData(req, res, next);
      req.telegramUser = { id: 999999, first_name: 'Local Dev User' };
      next();
    }
  : verifyTelegramWebAppData;

router.post('/shop/:slug/orders', authMiddleware, OrderController.createOrder);

module.exports = router;