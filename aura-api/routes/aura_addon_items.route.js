const createRouter = require('../core/createRouter');
const model = require('../models/aura_addon_items.model');
const controller = require('../controllers/aura_addon_items.controller');

module.exports = createRouter(controller, model);
