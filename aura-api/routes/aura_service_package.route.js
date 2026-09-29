const createRouter = require('../core/createRouter');
const model = require('../models/aura_service_package.model');
const controller = require('../controllers/aura_service_package.controller');

module.exports = createRouter(controller, model);
