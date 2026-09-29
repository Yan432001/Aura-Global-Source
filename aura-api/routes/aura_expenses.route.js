const createRouter = require('../core/createRouter');
const model = require('../models/aura_expenses.model');
const controller = require('../controllers/aura_expenses.controller');

module.exports = createRouter(controller, model);
