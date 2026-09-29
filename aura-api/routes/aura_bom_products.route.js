const createRouter = require('../core/createRouter');
const model = require('../models/aura_bom_products.model');
const controller = require('../controllers/aura_bom_products.controller');

module.exports = createRouter(controller, model);
