const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_student_documents.model');
const controller = require('../controllers/aura_sh_student_documents.controller');

module.exports = createRouter(controller, model);
