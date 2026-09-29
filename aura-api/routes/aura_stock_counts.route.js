const createRouter = require('../core/createRouter');
const model = require('../models/aura_stock_counts.model');
const controller = require('../controllers/aura_stock_counts.controller');

module.exports = createRouter(controller, model);
