const createRouter = require('../core/createRouter');
const model = require('../models/aura_loan_items.model');
const controller = require('../controllers/aura_loan_items.controller');

module.exports = createRouter(controller, model);
