const createRouter = require('../core/createRouter');
const model = require('../models/aura_money_exchange_rate.model');
const controller = require('../controllers/aura_money_exchange_rate.controller');

module.exports = createRouter(controller, model);
