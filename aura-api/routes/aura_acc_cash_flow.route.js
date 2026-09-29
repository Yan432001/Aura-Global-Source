const createRouter = require('../core/createRouter');
const model = require('../models/aura_acc_cash_flow.model');
const controller = require('../controllers/aura_acc_cash_flow.controller');

module.exports = createRouter(controller, model);
