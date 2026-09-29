const createRouter = require('../core/createRouter');
const model = require('../models/aura_gl_sections.model');
const controller = require('../controllers/aura_gl_sections.controller');

module.exports = createRouter(controller, model);
