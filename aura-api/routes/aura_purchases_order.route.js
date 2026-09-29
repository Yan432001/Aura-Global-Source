const createRouter = require('../core/createRouter');
const model = require('../models/aura_purchases_order.model');
const controller = require('../controllers/aura_purchases_order.controller');

module.exports = createRouter(controller, model);
