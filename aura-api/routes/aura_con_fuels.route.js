const createRouter = require('../core/createRouter');
const model = require('../models/aura_con_fuels.model');
const controller = require('../controllers/aura_con_fuels.controller');

module.exports = createRouter(controller, model);
