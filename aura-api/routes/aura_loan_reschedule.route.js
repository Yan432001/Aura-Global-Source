const createRouter = require('../core/createRouter');
const model = require('../models/aura_loan_reschedule.model');
const controller = require('../controllers/aura_loan_reschedule.controller');

module.exports = createRouter(controller, model);
