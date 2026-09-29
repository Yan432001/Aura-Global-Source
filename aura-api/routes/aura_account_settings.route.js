const createRouter = require('../core/createRouter');
const model = require('../models/aura_account_settings.model');
const controller = require('../controllers/aura_account_settings.controller');

module.exports = createRouter(controller, model);
