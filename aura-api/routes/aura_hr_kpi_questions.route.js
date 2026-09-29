const createRouter = require('../core/createRouter');
const model = require('../models/aura_hr_kpi_questions.model');
const controller = require('../controllers/aura_hr_kpi_questions.controller');

module.exports = createRouter(controller, model);
