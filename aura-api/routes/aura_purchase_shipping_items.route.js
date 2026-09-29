const createRouter = require('../core/createRouter');
const model = require('../models/aura_purchase_shipping_items.model');
const controller = require('../controllers/aura_purchase_shipping_items.controller');

module.exports = createRouter(controller, model);
