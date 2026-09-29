const createRouter = require('../core/createRouter');
const model = require('../models/aura_interest_period.model');
const controller = require('../controllers/aura_interest_period.controller');

module.exports = createRouter(controller, model);
