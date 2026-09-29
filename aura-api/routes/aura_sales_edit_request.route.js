const createRouter = require('../core/createRouter');
const model = require('../models/aura_sales_edit_request.model');
const controller = require('../controllers/aura_sales_edit_request.controller');

module.exports = createRouter(controller, model);
