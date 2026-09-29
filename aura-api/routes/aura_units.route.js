const createRouter = require('../core/createRouter');
const model = require('../models/aura_units.model');
const controller = require('../controllers/aura_units.controller');

module.exports = createRouter(controller, model);
