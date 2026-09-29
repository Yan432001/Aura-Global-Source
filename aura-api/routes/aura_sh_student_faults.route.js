const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_student_faults.model');
const controller = require('../controllers/aura_sh_student_faults.controller');

module.exports = createRouter(controller, model);
