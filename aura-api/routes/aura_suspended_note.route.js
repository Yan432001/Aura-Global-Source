const createRouter = require('../core/createRouter');
const model = require('../models/aura_suspended_note.model');
const controller = require('../controllers/aura_suspended_note.controller');

module.exports = createRouter(controller, model);
