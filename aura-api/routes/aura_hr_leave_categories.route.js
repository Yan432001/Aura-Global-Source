const createRouter = require('../core/createRouter');
const model = require('../models/aura_hr_leave_categories.model');
const controller = require('../controllers/aura_hr_leave_categories.controller');

module.exports = createRouter(controller, model);
