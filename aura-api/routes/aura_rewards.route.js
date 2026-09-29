const createRouter = require('../core/createRouter');
const model = require('../models/aura_rewards.model');
const controller = require('../controllers/aura_rewards.controller');

module.exports = createRouter(controller, model);
