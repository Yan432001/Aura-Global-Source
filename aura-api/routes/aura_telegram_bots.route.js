const createRouter = require('../core/createRouter');
const model = require('../models/aura_telegram_bots.model');
const controller = require('../controllers/aura_telegram_bots.controller');

module.exports = createRouter(controller, model);
