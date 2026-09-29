const createRouter = require('../core/createRouter');
const model = require('../models/aura_saving_products.model');
const controller = require('../controllers/aura_saving_products.controller');

module.exports = createRouter(controller, model);
