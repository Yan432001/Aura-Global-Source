const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_exam_student_subject_marks.model');
const controller = require('../controllers/aura_sh_exam_student_subject_marks.controller');

module.exports = createRouter(controller, model);
