const createRouter = require('../core/createRouter');
const model = require('../models/aura_account_product.model');
const controller = require('../controllers/aura_account_product.controller');

module.exports = createRouter(controller, model);
