const createRouter = require('../core/createRouter');
const model = require('../models/aura_sessions.model');
const controller = require('../controllers/aura_sessions.controller');

module.exports = createRouter(controller, model);
