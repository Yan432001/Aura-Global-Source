const createRouter = require('../core/createRouter');
const model = require('../models/aura_returns_request.model');
const controller = require('../controllers/aura_returns_request.controller');

module.exports = createRouter(controller, model);
