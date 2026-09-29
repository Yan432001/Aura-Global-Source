const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_course.model');
const controller = require('../controllers/aura_sh_course.controller');

module.exports = createRouter(controller, model);
