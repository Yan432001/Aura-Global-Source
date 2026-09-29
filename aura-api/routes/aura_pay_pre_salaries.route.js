const createRouter = require('../core/createRouter');
const model = require('../models/aura_pay_pre_salaries.model');
const controller = require('../controllers/aura_pay_pre_salaries.controller');

module.exports = createRouter(controller, model);
