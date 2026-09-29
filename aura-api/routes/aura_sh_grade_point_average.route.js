const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_grade_point_average.model');
const controller = require('../controllers/aura_sh_grade_point_average.controller');

module.exports = createRouter(controller, model);
