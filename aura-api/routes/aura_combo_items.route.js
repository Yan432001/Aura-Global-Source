const createRouter = require('../core/createRouter');
const model = require('../models/aura_combo_items.model');
const controller = require('../controllers/aura_combo_items.controller');

module.exports = createRouter(controller, model);
