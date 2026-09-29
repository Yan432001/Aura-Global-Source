const createRouter = require('../core/createRouter');
const model = require('../models/aura_currencies.model');
const controller = require('../controllers/aura_currencies.controller');

module.exports = createRouter(controller, model);
