const createRouter = require('../core/createRouter');
const model = require('../models/aura_hr_employees_emergency.model');
const controller = require('../controllers/aura_hr_employees_emergency.controller');

module.exports = createRouter(controller, model);
