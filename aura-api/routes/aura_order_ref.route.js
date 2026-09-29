const createRouter = require('../core/createRouter');
const model = require('../models/aura_order_ref.model');
const controller = require('../controllers/aura_order_ref.controller');

module.exports = createRouter(controller, model);
