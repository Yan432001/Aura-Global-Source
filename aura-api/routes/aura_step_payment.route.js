const createRouter = require('../core/createRouter');
const model = require('../models/aura_step_payment.model');
const controller = require('../controllers/aura_step_payment.controller');

module.exports = createRouter(controller, model);
