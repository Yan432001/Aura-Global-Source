const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_testing_results.model');
const controller = require('../controllers/aura_sh_testing_results.controller');

module.exports = createRouter(controller, model);
