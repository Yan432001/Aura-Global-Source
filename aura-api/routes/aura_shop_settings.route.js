const createRouter = require('../core/createRouter');
const model = require('../models/aura_shop_settings.model');
const controller = require('../controllers/aura_shop_settings.controller');

module.exports = createRouter(controller, model);
