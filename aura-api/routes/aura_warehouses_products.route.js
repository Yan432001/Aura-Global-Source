const createRouter = require('../core/createRouter');
const model = require('../models/aura_warehouses_products.model');
const controller = require('../controllers/aura_warehouses_products.controller');

module.exports = createRouter(controller, model);
