const createRouter = require('../core/createRouter');
const model = require('../models/aura_loan_borrowers.model');
const controller = require('../controllers/aura_loan_borrowers.controller');

module.exports = createRouter(controller, model);
