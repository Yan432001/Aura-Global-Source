const createRouter = require('../core/createRouter');
const model = require('../models/aura_hr_departments.model');
const controller = require('../controllers/aura_hr_departments.controller');

module.exports = createRouter(controller, model);
