const createRouter = require('../core/createRouter');
const model = require('../models/aura_tank_nozzles.model');
const controller = require('../controllers/aura_tank_nozzles.controller');

module.exports = createRouter(controller, model);
