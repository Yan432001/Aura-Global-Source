const createRouter = require('../core/createRouter');
const model = require('../models/aura_loan_applications.model');
const controller = require('../controllers/aura_loan_applications.controller');

module.exports = createRouter(controller, model);
