const createRouter = require('../core/createRouter');
const model = require('../models/aura_loans.model');
const controller = require('../controllers/aura_loans.controller');

module.exports = createRouter(controller, model);
