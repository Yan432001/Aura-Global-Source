const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_teacher_attendances.model');
const controller = require('../controllers/aura_sh_teacher_attendances.controller');

module.exports = createRouter(controller, model);
