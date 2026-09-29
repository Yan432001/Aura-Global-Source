const createRouter = require('../core/createRouter');
const model = require('../models/aura_con_error_items.model');
const controller = require('../controllers/aura_con_error_items.controller');

module.exports = createRouter(controller, model);
