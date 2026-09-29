const createRouter = require('../core/createRouter');
const model = require('../models/aura_hr_warning.model');
const controller = require('../controllers/aura_hr_warning.controller');

module.exports = createRouter(controller, model);
