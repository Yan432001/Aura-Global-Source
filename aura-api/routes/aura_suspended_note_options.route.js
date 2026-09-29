const createRouter = require('../core/createRouter');
const model = require('../models/aura_suspended_note_options.model');
const controller = require('../controllers/aura_suspended_note_options.controller');

module.exports = createRouter(controller, model);
