const createRouter = require('../core/createRouter');
const model = require('../models/aura_hr_employees_contract.model');
const controller = require('../controllers/aura_hr_employees_contract.controller');

module.exports = createRouter(controller, model);
