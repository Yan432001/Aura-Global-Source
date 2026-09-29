const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_subjects.model');
const controller = require('../controllers/aura_sh_subjects.controller');

module.exports = createRouter(controller, model);
