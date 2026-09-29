const createRouter = require('../core/createRouter');
const model = require('../models/aura_rewards_exchange.model');
const controller = require('../controllers/aura_rewards_exchange.controller');

module.exports = createRouter(controller, model);
