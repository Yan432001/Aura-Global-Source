const createRouter = require('../core/createRouter');
const model = require('../models/aura_stock_type.model');
const controller = require('../controllers/aura_stock_type.controller');

module.exports = createRouter(controller, model);
