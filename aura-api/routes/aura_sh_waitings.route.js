const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_waitings.model');
const controller = require('../controllers/aura_sh_waitings.controller');

module.exports = createRouter(controller, model);
