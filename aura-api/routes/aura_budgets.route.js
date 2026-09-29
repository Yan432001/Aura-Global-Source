const createRouter = require('../core/createRouter');
const model = require('../models/aura_budgets.model');
const controller = require('../controllers/aura_budgets.controller');

module.exports = createRouter(controller, model);
