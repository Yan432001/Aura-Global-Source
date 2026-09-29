const createRouter = require('../core/createRouter');
const model = require('../models/aura_deposits.model');
const controller = require('../controllers/aura_deposits.controller');

module.exports = createRouter(controller, model);
