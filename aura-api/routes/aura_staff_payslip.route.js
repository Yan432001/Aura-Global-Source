const createRouter = require('../core/createRouter');
const model = require('../models/aura_staff_payslip.model');
const controller = require('../controllers/aura_staff_payslip.controller');

module.exports = createRouter(controller, model);
