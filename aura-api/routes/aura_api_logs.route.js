const createRouter = require('../core/createRouter');
const model = require('../models/aura_api_logs.model');
const controller = require('../controllers/aura_api_logs.controller');

module.exports = createRouter(controller, model);
