const createRouter = require('../core/createRouter');
const model = require('../models/aura_receive_payments.model');
const controller = require('../controllers/aura_receive_payments.controller');

module.exports = createRouter(controller, model);
