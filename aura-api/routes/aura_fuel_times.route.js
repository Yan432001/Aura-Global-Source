const createRouter = require('../core/createRouter');
const model = require('../models/aura_fuel_times.model');
const controller = require('../controllers/aura_fuel_times.controller');

module.exports = createRouter(controller, model);
