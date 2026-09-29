const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_exam_schedules.model');
const controller = require('../controllers/aura_sh_exam_schedules.controller');

module.exports = createRouter(controller, model);
