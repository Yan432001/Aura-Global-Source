const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_feedback_questions.model');
const controller = require('../controllers/aura_sh_feedback_questions.controller');

module.exports = createRouter(controller, model);
