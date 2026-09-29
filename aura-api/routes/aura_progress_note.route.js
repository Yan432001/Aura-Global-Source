const createRouter = require('../core/createRouter');
const model = require('../models/aura_progress_note.model');
const controller = require('../controllers/aura_progress_note.controller');

module.exports = createRouter(controller, model);
