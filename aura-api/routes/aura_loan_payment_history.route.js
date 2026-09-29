const createRouter = require('../core/createRouter');
const model = require('../models/aura_loan_payment_history.model');
const controller = require('../controllers/aura_loan_payment_history.controller');

module.exports = createRouter(controller, model);
