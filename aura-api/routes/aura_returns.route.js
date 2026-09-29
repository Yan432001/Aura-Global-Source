const createRouter = require('../core/createRouter');
const model = require('../models/aura_returns.model');
const controller = require('../controllers/aura_returns.controller');

module.exports = createRouter(controller, model);
