const createRouter = require('../core/createRouter');
const model = require('../models/aura_adjustments.model');
const controller = require('../controllers/aura_adjustments.controller');

module.exports = createRouter(controller, model);
