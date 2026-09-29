const createRouter = require('../core/createRouter');
const model = require('../models/aura_multi_buys_prices.model');
const controller = require('../controllers/aura_multi_buys_prices.controller');

module.exports = createRouter(controller, model);
