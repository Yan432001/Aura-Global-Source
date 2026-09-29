const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_teacher_qualifications.model');
const controller = require('../controllers/aura_sh_teacher_qualifications.controller');

module.exports = createRouter(controller, model);
