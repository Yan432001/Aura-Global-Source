const createRouter = require('../core/createRouter');
const model = require('../models/aura_stock_movement.model');
const controller = require('../controllers/aura_stock_movement.controller');

module.exports = createRouter(controller, model);
