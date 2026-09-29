const createRouter = require('../core/createRouter');
const model = require('../models/aura_stock_count_items.model');
const controller = require('../controllers/aura_stock_count_items.controller');

module.exports = createRouter(controller, model);
