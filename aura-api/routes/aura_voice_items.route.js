const createRouter = require('../core/createRouter');
const model = require('../models/aura_voice_items.model');
const controller = require('../controllers/aura_voice_items.controller');

module.exports = createRouter(controller, model);
