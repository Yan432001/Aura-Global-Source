const createRouter = require('../core/createRouter');
const model = require('../models/aura_expenses_customer.model');
const controller = require('../controllers/aura_expenses_customer.controller');

module.exports = createRouter(controller, model);
