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

router.get('/store/:slug', StoreController.getStore);
router.get('/store/:slug/categories', StoreController.getCategories);
router.get('/store/:slug/products', StoreController.getProducts);
router.get('/store/:slug/catalog', StoreController.getProducts);

// Orders query endpoint
router.get('/orders', OrderController.getOrders);
router.get('/shop/:slug/orders', OrderController.getOrders);
router.get('/store/:slug/orders', OrderController.getOrders);

// Secure checkout (Permits conditional local testing or strict initData enforcement)
const authMiddleware = process.env.NODE_ENV === 'development'
  ? (req, res, next) => {
      if (req.headers['x-telegram-init-data']) return verifyTelegramWebAppData(req, res, next);
      req.telegramUser = { id: 999999, first_name: 'Local Dev User' };
      next();
    }
  : verifyTelegramWebAppData;

router.post('/shop/:slug/orders', authMiddleware, OrderController.createOrder);
router.post('/store/:slug/order', authMiddleware, OrderController.createOrder);
router.post('/checkout', authMiddleware, OrderController.createOrder);

module.exports = router;