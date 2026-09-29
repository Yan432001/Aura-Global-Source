const createRouter = require('../core/createRouter');
const model = require('../models/aura_con_adjustments.model');
const controller = require('../controllers/aura_con_adjustments.controller');

module.exports = createRouter(controller, model);
