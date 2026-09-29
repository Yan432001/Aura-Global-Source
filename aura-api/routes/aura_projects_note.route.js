const createRouter = require('../core/createRouter');
const model = require('../models/aura_projects_note.model');
const controller = require('../controllers/aura_projects_note.controller');

module.exports = createRouter(controller, model);
