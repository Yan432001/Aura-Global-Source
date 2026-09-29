const createRouter = require('../core/createRouter');
const model = require('../models/aura_module_user.model');
const controller = require('../controllers/aura_module_user.controller');

module.exports = createRouter(controller, model);
