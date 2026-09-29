const createRouter = require('../core/createRouter');
const model = require('../models/aura_money_exchange.model');
const controller = require('../controllers/aura_money_exchange.controller');

module.exports = createRouter(controller, model);
