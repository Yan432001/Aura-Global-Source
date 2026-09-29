const createRouter = require('../core/createRouter');
const model = require('../models/aura_machine_types.model');
const controller = require('../controllers/aura_machine_types.controller');

module.exports = createRouter(controller, model);
