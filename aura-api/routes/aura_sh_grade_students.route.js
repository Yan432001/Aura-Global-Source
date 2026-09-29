const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_grade_students.model');
const controller = require('../controllers/aura_sh_grade_students.controller');

module.exports = createRouter(controller, model);
