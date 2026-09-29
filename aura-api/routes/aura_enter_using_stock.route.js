const createRouter = require('../core/createRouter');
const model = require('../models/aura_enter_using_stock.model');
const controller = require('../controllers/aura_enter_using_stock.controller');

module.exports = createRouter(controller, model);
