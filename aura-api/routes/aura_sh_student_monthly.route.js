const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_student_monthly.model');
const controller = require('../controllers/aura_sh_student_monthly.controller');

module.exports = createRouter(controller, model);
