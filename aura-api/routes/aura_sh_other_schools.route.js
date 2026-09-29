const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_other_schools.model');
const controller = require('../controllers/aura_sh_other_schools.controller');

module.exports = createRouter(controller, model);
