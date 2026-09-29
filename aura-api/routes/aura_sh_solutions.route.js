const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_solutions.model');
const controller = require('../controllers/aura_sh_solutions.controller');

module.exports = createRouter(controller, model);
