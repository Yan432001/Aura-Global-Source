const createRouter = require('../core/createRouter');
const model = require('../models/aura_api_limits.model');
const controller = require('../controllers/aura_api_limits.controller');

module.exports = createRouter(controller, model);
