const createRouter = require('../core/createRouter');
const model = require('../models/aura_pay_pre_salary_payments.model');
const controller = require('../controllers/aura_pay_pre_salary_payments.controller');

module.exports = createRouter(controller, model);
