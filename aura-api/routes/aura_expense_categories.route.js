const createRouter = require('../core/createRouter');
const model = require('../models/aura_expense_categories.model');
const controller = require('../controllers/aura_expense_categories.controller');

module.exports = createRouter(controller, model);
