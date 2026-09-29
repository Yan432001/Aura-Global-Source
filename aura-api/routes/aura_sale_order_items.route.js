const createRouter = require('../core/createRouter');
const model = require('../models/aura_sale_order_items.model');
const controller = require('../controllers/aura_sale_order_items.controller');

module.exports = createRouter(controller, model);
