const createRouter = require('../core/createRouter');
const model = require('../models/aura_telegram_customers.model');
const controller = require('../controllers/aura_telegram_customers.controller');

module.exports = createRouter(controller, model);
