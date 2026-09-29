const createRouter = require('../core/createRouter');
const model = require('../models/aura_customer_package.model');
const controller = require('../controllers/aura_customer_package.controller');

module.exports = createRouter(controller, model);
