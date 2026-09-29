const createRouter = require('../core/createRouter');
const model = require('../models/aura_warehouses.model');
const controller = require('../controllers/aura_warehouses.controller');

module.exports = createRouter(controller, model);
