const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_follow_ups.model');
const controller = require('../controllers/aura_sh_follow_ups.controller');

module.exports = createRouter(controller, model);
