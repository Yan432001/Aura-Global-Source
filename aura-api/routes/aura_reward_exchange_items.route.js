const createRouter = require('../core/createRouter');
const model = require('../models/aura_reward_exchange_items.model');
const controller = require('../controllers/aura_reward_exchange_items.controller');

module.exports = createRouter(controller, model);
