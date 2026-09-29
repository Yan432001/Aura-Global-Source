const createRouter = require('../core/createRouter');
const model = require('../models/aura_pay_cash_advances.model');
const controller = require('../controllers/aura_pay_cash_advances.controller');

module.exports = createRouter(controller, model);
