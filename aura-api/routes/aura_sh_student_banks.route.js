const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_student_banks.model');
const controller = require('../controllers/aura_sh_student_banks.controller');

module.exports = createRouter(controller, model);
