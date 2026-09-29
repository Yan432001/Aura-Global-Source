const createRouter = require('../core/createRouter');
const model = require('../models/aura_product_prices.model');
const controller = require('../controllers/aura_product_prices.controller');

module.exports = createRouter(controller, model);
