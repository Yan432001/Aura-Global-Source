const createRouter = require('../core/createRouter');
const model = require('../models/aura_hr_kpi_measures.model');
const controller = require('../controllers/aura_hr_kpi_measures.controller');

module.exports = createRouter(controller, model);
