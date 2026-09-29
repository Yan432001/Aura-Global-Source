const createRouter = require('../core/createRouter');
const model = require('../models/aura_hr_salary_review_items.model');
const controller = require('../controllers/aura_hr_salary_review_items.controller');

module.exports = createRouter(controller, model);
