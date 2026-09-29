const createRouter = require('../core/createRouter');
const model = require('../models/aura_tank_nozzle_salesmans.model');
const controller = require('../controllers/aura_tank_nozzle_salesmans.controller');

module.exports = createRouter(controller, model);
