const createRouter = require('../core/createRouter');
const model = require('../models/aura_maintenance.model');
const controller = require('../controllers/aura_maintenance.controller');

module.exports = createRouter(controller, model);
