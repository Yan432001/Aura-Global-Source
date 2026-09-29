const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_lesson.model');
const controller = require('../controllers/aura_sh_lesson.controller');

module.exports = createRouter(controller, model);
