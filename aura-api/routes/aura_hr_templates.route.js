const createRouter = require('../core/createRouter');
const model = require('../models/aura_hr_templates.model');
const controller = require('../controllers/aura_hr_templates.controller');

module.exports = createRouter(controller, model);
