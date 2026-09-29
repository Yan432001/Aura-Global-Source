const createRouter = require('../core/createRouter');
const model = require('../models/aura_maintenance_items.model');
const controller = require('../controllers/aura_maintenance_items.controller');

module.exports = createRouter(controller, model);
