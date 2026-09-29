const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_colleges.model');
const controller = require('../controllers/aura_sh_colleges.controller');

module.exports = createRouter(controller, model);
