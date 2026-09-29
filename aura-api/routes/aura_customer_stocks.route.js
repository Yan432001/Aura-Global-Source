const createRouter = require('../core/createRouter');
const model = require('../models/aura_customer_stocks.model');
const controller = require('../controllers/aura_customer_stocks.controller');

module.exports = createRouter(controller, model);
