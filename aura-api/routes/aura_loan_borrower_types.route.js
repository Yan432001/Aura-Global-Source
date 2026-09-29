const createRouter = require('../core/createRouter');
const model = require('../models/aura_loan_borrower_types.model');
const controller = require('../controllers/aura_loan_borrower_types.controller');

module.exports = createRouter(controller, model);
