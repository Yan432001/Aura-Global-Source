const createRouter = require('../core/createRouter');
const model = require('../models/aura_hr_tax_condition.model');
const controller = require('../controllers/aura_hr_tax_condition.controller');

module.exports = createRouter(controller, model);
