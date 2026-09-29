const createRouter = require('../core/createRouter');
const model = require('../models/aura_hr_employees_working_history.model');
const controller = require('../controllers/aura_hr_employees_working_history.controller');

module.exports = createRouter(controller, model);
