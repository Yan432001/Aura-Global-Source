const createRouter = require('../core/createRouter');
const model = require('../models/aura_currency_calenders.model');
const controller = require('../controllers/aura_currency_calenders.controller');

module.exports = createRouter(controller, model);
