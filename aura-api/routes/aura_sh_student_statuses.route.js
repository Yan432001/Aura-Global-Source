const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_student_statuses.model');
const controller = require('../controllers/aura_sh_student_statuses.controller');

module.exports = createRouter(controller, model);
