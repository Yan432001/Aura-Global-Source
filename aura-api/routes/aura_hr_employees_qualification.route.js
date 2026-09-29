const createRouter = require('../core/createRouter');
const model = require('../models/aura_hr_employees_qualification.model');
const controller = require('../controllers/aura_hr_employees_qualification.controller');

module.exports = createRouter(controller, model);
