const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_black_lists.model');
const controller = require('../controllers/aura_sh_black_lists.controller');

module.exports = createRouter(controller, model);
