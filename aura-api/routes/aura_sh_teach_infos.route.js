const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_teach_infos.model');
const controller = require('../controllers/aura_sh_teach_infos.controller');

module.exports = createRouter(controller, model);
