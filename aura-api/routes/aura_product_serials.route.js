const createRouter = require('../core/createRouter');
const model = require('../models/aura_product_serials.model');
const controller = require('../controllers/aura_product_serials.controller');

module.exports = createRouter(controller, model);
