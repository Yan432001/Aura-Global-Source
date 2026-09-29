const createRouter = require('../core/createRouter');
const model = require('../models/aura_hr_employees_bank.model');
const controller = require('../controllers/aura_hr_employees_bank.controller');

module.exports = createRouter(controller, model);
