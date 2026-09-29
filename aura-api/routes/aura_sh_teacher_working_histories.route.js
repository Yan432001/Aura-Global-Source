const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_teacher_working_histories.model');
const controller = require('../controllers/aura_sh_teacher_working_histories.controller');

module.exports = createRouter(controller, model);
