const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_sections.model');
const controller = require('../controllers/aura_sh_sections.controller');

module.exports = createRouter(controller, model);
