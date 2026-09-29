const createRouter = require('../core/createRouter');
const model = require('../models/aura_bom_items.model');
const controller = require('../controllers/aura_bom_items.controller');

module.exports = createRouter(controller, model);
