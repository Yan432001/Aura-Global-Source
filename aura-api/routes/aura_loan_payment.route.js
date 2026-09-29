const createRouter = require('../core/createRouter');
const model = require('../models/aura_loan_payment.model');
const controller = require('../controllers/aura_loan_payment.controller');

module.exports = createRouter(controller, model);
