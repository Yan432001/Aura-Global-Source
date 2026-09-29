const createRouter = require('../core/createRouter');
const model = require('../models/aura_savings_cancel_transactions.model');
const controller = require('../controllers/aura_savings_cancel_transactions.controller');

module.exports = createRouter(controller, model);
