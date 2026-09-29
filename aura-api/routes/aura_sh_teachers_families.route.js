const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_teachers_families.model');
const controller = require('../controllers/aura_sh_teachers_families.controller');

module.exports = createRouter(controller, model);
