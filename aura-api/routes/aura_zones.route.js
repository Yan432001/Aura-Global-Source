const createRouter = require('../core/createRouter');
const model = require('../models/aura_zones.model');
const controller = require('../controllers/aura_zones.controller');

module.exports = createRouter(controller, model);
