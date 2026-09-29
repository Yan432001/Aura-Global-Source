const createRouter = require('../core/createRouter');
const model = require('../models/aura_costing.model');
const controller = require('../controllers/aura_costing.controller');

module.exports = createRouter(controller, model);
