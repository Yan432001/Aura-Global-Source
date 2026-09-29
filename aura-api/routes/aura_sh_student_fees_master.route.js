const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_student_fees_master.model');
const controller = require('../controllers/aura_sh_student_fees_master.controller');

module.exports = createRouter(controller, model);
