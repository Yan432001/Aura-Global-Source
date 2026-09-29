const createRouter = require('../core/createRouter');
const model = require('../models/aura_addon_items_note.model');
const controller = require('../controllers/aura_addon_items_note.controller');

module.exports = createRouter(controller, model);
