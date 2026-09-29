const createRouter = require('../core/createRouter');
const model = require('../models/aura_fuel_sales.model');
const controller = require('../controllers/aura_fuel_sales.controller');

module.exports = createRouter(controller, model);
