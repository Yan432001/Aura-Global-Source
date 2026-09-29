const createRouter = require('../core/createRouter');
const model = require('../models/aura_product_options.model');
const controller = require('../controllers/aura_product_options.controller');

module.exports = createRouter(controller, model);
