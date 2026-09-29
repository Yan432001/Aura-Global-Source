const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_family_groups.model');
const controller = require('../controllers/aura_sh_family_groups.controller');

module.exports = createRouter(controller, model);
