const createRouter = require('../core/createRouter');
const model = require('../models/aura_pay_payment_items_13.model');
const controller = require('../controllers/aura_pay_payment_items_13.controller');

module.exports = createRouter(controller, model);
