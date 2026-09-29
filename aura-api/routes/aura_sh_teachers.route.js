const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_teachers.model');
const controller = require('../controllers/aura_sh_teachers.controller');

module.exports = createRouter(controller, model);
