const createRouter = require('../core/createRouter');
const model = require('../models/aura_payments_requested.model');
const controller = require('../controllers/aura_payments_requested.controller');

module.exports = createRouter(controller, model);
