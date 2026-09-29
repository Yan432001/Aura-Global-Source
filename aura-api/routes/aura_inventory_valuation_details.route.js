const createRouter = require('../core/createRouter');
const model = require('../models/aura_inventory_valuation_details.model');
const controller = require('../controllers/aura_inventory_valuation_details.controller');

module.exports = createRouter(controller, model);
