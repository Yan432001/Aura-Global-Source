const createRouter = require('../core/createRouter');
const model = require('../models/aura_user_logins.model');
const controller = require('../controllers/aura_user_logins.controller');

module.exports = createRouter(controller, model);
