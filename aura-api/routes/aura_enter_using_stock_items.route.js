const createRouter = require('../core/createRouter');
const model = require('../models/aura_enter_using_stock_items.model');
const controller = require('../controllers/aura_enter_using_stock_items.controller');

module.exports = createRouter(controller, model);
