const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_programs.model');
const controller = require('../controllers/aura_sh_programs.controller');

module.exports = createRouter(controller, model);
