const createRouter = require('../core/createRouter');
const model = require('../models/aura_loan_charges.model');
const controller = require('../controllers/aura_loan_charges.controller');

module.exports = createRouter(controller, model);
