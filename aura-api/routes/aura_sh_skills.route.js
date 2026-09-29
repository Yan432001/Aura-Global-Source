const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_skills.model');
const controller = require('../controllers/aura_sh_skills.controller');

module.exports = createRouter(controller, model);
