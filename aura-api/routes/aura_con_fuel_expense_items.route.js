const createRouter = require('../core/createRouter');
const model = require('../models/aura_con_fuel_expense_items.model');
const controller = require('../controllers/aura_con_fuel_expense_items.controller');

module.exports = createRouter(controller, model);
