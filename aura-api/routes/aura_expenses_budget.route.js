const createRouter = require('../core/createRouter');
const model = require('../models/aura_expenses_budget.model');
const controller = require('../controllers/aura_expenses_budget.controller');

module.exports = createRouter(controller, model);
