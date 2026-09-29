const createRouter = require('../core/createRouter');
const model = require('../models/aura_fuel_sale_items.model');
const controller = require('../controllers/aura_fuel_sale_items.controller');

module.exports = createRouter(controller, model);
