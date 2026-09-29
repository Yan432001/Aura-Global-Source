const createRouter = require('../core/createRouter');
const model = require('../models/aura_product_units.model');
const controller = require('../controllers/aura_product_units.controller');

module.exports = createRouter(controller, model);
