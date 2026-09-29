const createRouter = require('../core/createRouter');
const model = require('../models/aura_hr_employees_level.model');
const controller = require('../controllers/aura_hr_employees_level.controller');

module.exports = createRouter(controller, model);
