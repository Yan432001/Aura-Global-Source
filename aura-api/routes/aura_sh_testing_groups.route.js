const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_testing_groups.model');
const controller = require('../controllers/aura_sh_testing_groups.controller');

module.exports = createRouter(controller, model);
