const createRouter = require('../core/createRouter');
const model = require('../models/aura_sales.model');
const controller = require('../controllers/aura_sales.controller');

module.exports = createRouter(controller, model);
