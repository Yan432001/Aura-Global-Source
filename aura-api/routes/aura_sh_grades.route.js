const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_grades.model');
const controller = require('../controllers/aura_sh_grades.controller');

module.exports = createRouter(controller, model);
