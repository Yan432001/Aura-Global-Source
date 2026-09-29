const createRouter = require('../core/createRouter');
const model = require('../models/aura_stock_received.model');
const controller = require('../controllers/aura_stock_received.controller');

module.exports = createRouter(controller, model);
