const createRouter = require('../core/createRouter');
const model = require('../models/aura_repairs.model');
const controller = require('../controllers/aura_repairs.controller');

module.exports = createRouter(controller, model);
