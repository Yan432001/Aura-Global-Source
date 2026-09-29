const createRouter = require('../core/createRouter');
const model = require('../models/aura_pay_cash_advance_paybacks.model');
const controller = require('../controllers/aura_pay_cash_advance_paybacks.controller');

module.exports = createRouter(controller, model);
