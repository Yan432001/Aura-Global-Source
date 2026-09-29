const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_student_yearly.model');
const controller = require('../controllers/aura_sh_student_yearly.controller');

module.exports = createRouter(controller, model);
