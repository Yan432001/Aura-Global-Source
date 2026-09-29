const createRouter = require('../core/createRouter');
const model = require('../models/aura_login_attempts.model');
const controller = require('../controllers/aura_login_attempts.controller');

module.exports = createRouter(controller, model);
