const createRouter = require('../core/createRouter');
const model = require('../models/aura_consignments.model');
const controller = require('../controllers/aura_consignments.controller');

module.exports = createRouter(controller, model);
