const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_assign_class_teacher.model');
const controller = require('../controllers/aura_sh_assign_class_teacher.controller');

module.exports = createRouter(controller, model);
