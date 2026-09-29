const createRouter = require('../core/createRouter');
const model = require('../models/aura_payment_term.model');
const controller = require('../controllers/aura_payment_term.controller');

module.exports = createRouter(controller, model);
