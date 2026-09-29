const createRouter = require('../core/createRouter');
const model = require('../models/aura_hr_employees_document.model');
const controller = require('../controllers/aura_hr_employees_document.controller');

module.exports = createRouter(controller, model);
