const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_exams.model');
const controller = require('../controllers/aura_sh_exams.controller');

module.exports = createRouter(controller, model);
