const createRouter = require('../core/createRouter');
const model = require('../models/aura_delivery_items.model');
const controller = require('../controllers/aura_delivery_items.controller');

module.exports = createRouter(controller, model);
