const createRouter = require('../core/createRouter');
const model = require('../models/aura_product_rack.model');
const controller = require('../controllers/aura_product_rack.controller');

module.exports = createRouter(controller, model);
