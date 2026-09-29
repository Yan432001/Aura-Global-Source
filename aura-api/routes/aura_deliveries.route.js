const createRouter = require('../core/createRouter');
const model = require('../models/aura_deliveries.model');
const controller = require('../controllers/aura_deliveries.controller');

module.exports = createRouter(controller, model);
