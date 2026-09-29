const createRouter = require('../core/createRouter');
const model = require('../models/aura_con_sales.model');
const controller = require('../controllers/aura_con_sales.controller');

module.exports = createRouter(controller, model);
