const createRouter = require('../core/createRouter');
const model = require('../models/aura_hr_employees_relationship.model');
const controller = require('../controllers/aura_hr_employees_relationship.controller');

module.exports = createRouter(controller, model);
