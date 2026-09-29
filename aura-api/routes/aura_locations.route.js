const createRouter = require('../core/createRouter');
const model = require('../models/aura_locations.model');
const controller = require('../controllers/aura_locations.controller');

module.exports = createRouter(controller, model);
