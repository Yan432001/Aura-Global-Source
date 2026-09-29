const createRouter = require('../core/createRouter');
const model = require('../models/aura_fuel_customers.model');
const controller = require('../controllers/aura_fuel_customers.controller');

module.exports = createRouter(controller, model);
