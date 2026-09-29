const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_examinations.model');
const controller = require('../controllers/aura_sh_examinations.controller');

module.exports = createRouter(controller, model);
