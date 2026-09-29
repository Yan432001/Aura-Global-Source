const createRouter = require('../core/createRouter');
const model = require('../models/aura_down_payments.model');
const controller = require('../controllers/aura_down_payments.controller');

module.exports = createRouter(controller, model);
