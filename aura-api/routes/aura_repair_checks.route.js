const createRouter = require('../core/createRouter');
const model = require('../models/aura_repair_checks.model');
const controller = require('../controllers/aura_repair_checks.controller');

module.exports = createRouter(controller, model);
