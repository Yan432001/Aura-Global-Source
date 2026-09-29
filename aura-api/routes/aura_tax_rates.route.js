const createRouter = require('../core/createRouter');
const model = require('../models/aura_tax_rates.model');
const controller = require('../controllers/aura_tax_rates.controller');

module.exports = createRouter(controller, model);
