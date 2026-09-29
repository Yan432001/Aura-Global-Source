const createRouter = require('../core/createRouter');
const model = require('../models/aura_loan_working_status.model');
const controller = require('../controllers/aura_loan_working_status.controller');

module.exports = createRouter(controller, model);
