const createRouter = require('../core/createRouter');
const model = require('../models/aura_repair_items.model');
const controller = require('../controllers/aura_repair_items.controller');

module.exports = createRouter(controller, model);
