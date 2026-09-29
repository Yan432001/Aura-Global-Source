const createRouter = require('../core/createRouter');
const model = require('../models/aura_cost_price_by_units.model');
const controller = require('../controllers/aura_cost_price_by_units.controller');

module.exports = createRouter(controller, model);
