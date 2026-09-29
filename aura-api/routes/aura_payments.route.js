const createRouter = require('../core/createRouter');
const model = require('../models/aura_payments.model');
const controller = require('../controllers/aura_payments.controller');

module.exports = createRouter(controller, model);
