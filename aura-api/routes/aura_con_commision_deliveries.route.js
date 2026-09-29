const createRouter = require('../core/createRouter');
const model = require('../models/aura_con_commision_deliveries.model');
const controller = require('../controllers/aura_con_commision_deliveries.controller');

module.exports = createRouter(controller, model);
