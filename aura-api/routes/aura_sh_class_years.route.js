const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_class_years.model');
const controller = require('../controllers/aura_sh_class_years.controller');

module.exports = createRouter(controller, model);
