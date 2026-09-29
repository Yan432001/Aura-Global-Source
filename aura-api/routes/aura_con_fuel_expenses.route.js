const createRouter = require('../core/createRouter');
const model = require('../models/aura_con_fuel_expenses.model');
const controller = require('../controllers/aura_con_fuel_expenses.controller');

module.exports = createRouter(controller, model);
