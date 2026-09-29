const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_teacher_documents.model');
const controller = require('../controllers/aura_sh_teacher_documents.controller');

module.exports = createRouter(controller, model);
