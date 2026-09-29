const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_grade_testings.model');
const controller = require('../controllers/aura_sh_grade_testings.controller');

module.exports = createRouter(controller, model);
