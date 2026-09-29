const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_attendances.model');
const controller = require('../controllers/aura_sh_attendances.controller');

module.exports = createRouter(controller, model);
