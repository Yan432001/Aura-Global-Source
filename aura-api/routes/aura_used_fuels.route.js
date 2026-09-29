const createRouter = require('../core/createRouter');
const model = require('../models/aura_used_fuels.model');
const controller = require('../controllers/aura_used_fuels.controller');

module.exports = createRouter(controller, model);
