const createRouter = require('../core/createRouter');
const model = require('../models/aura_purchase_shippings.model');
const controller = require('../controllers/aura_purchase_shippings.controller');

module.exports = createRouter(controller, model);
