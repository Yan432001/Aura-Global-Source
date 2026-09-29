const createRouter = require('../core/createRouter');
const model = require('../models/aura_hr_nssf_condition.model');
const controller = require('../controllers/aura_hr_nssf_condition.controller');

module.exports = createRouter(controller, model);
