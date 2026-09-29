const createRouter = require('../core/createRouter');
const model = require('../models/aura_hr_employees_working_info.model');
const controller = require('../controllers/aura_hr_employees_working_info.controller');

module.exports = createRouter(controller, model);
