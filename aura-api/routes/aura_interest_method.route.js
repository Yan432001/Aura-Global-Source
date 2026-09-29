const createRouter = require('../core/createRouter');
const model = require('../models/aura_interest_method.model');
const controller = require('../controllers/aura_interest_method.controller');

module.exports = createRouter(controller, model);
