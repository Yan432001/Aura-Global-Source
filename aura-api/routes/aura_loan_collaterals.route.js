const createRouter = require('../core/createRouter');
const model = require('../models/aura_loan_collaterals.model');
const controller = require('../controllers/aura_loan_collaterals.controller');

module.exports = createRouter(controller, model);
