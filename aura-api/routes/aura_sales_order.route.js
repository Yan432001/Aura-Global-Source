const createRouter = require('../core/createRouter');
const model = require('../models/aura_sales_order.model');
const controller = require('../controllers/aura_sales_order.controller');

module.exports = createRouter(controller, model);
