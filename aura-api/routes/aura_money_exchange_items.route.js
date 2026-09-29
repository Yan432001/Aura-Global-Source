const createRouter = require('../core/createRouter');
const model = require('../models/aura_money_exchange_items.model');
const controller = require('../controllers/aura_money_exchange_items.controller');

module.exports = createRouter(controller, model);
