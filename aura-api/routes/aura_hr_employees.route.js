const createRouter = require('../core/createRouter');
const model = require('../models/aura_hr_employees.model');
const controller = require('../controllers/aura_hr_employees.controller');

module.exports = createRouter(controller, model);
