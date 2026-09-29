const createRouter = require('../core/createRouter');
const model = require('../models/aura_warehouses_products_variants.model');
const controller = require('../controllers/aura_warehouses_products_variants.controller');

module.exports = createRouter(controller, model);
