const createRouter = require('../core/createRouter');
const model = require('../models/aura_receive_payment_items.model');
const controller = require('../controllers/aura_receive_payment_items.controller');

module.exports = createRouter(controller, model);
