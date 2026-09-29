const createRouter = require('../core/createRouter');
const model = require('../models/aura_vehicles.model');
const controller = require('../controllers/aura_vehicles.controller');

module.exports = createRouter(controller, model);
