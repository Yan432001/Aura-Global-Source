const createRouter = require('../core/createRouter');
const model = require('../models/aura_paypal.model');
const controller = require('../controllers/aura_paypal.controller');

module.exports = createRouter(controller, model);
