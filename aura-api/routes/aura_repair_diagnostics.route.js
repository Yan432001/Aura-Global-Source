const createRouter = require('../core/createRouter');
const model = require('../models/aura_repair_diagnostics.model');
const controller = require('../controllers/aura_repair_diagnostics.controller');

module.exports = createRouter(controller, model);
