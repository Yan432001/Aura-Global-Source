const createRouter = require('../core/createRouter');
const model = require('../models/aura_return_sales.model');
const controller = require('../controllers/aura_return_sales.controller');

module.exports = createRouter(controller, model);
