const express = require('express');
const router = express.Router();
const emenuController = require('../../controller/emenu.controller');
const validateTelegramInitData = require('../../middleware/telegramAuth.middleware');

router.get('/store/:identifier', emenuController.resolveStore);
router.get('/store/:identifier/menu', emenuController.getStoreMenu);
router.post('/store/:identifier/checkout', validateTelegramInitData, emenuController.submitOrder);

module.exports = router;