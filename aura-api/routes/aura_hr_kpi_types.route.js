const createRouter = require('../core/createRouter');
const model = require('../models/aura_hr_kpi_types.model');
const controller = require('../controllers/aura_hr_kpi_types.controller');

module.exports = createRouter(controller, model);
