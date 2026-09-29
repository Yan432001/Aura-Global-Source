const createRouter = require('../core/createRouter');
const model = require('../models/aura_api_keys.model');
const controller = require('../controllers/aura_api_keys.controller');

module.exports = createRouter(controller, model);
