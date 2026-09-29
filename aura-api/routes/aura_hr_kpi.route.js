const createRouter = require('../core/createRouter');
const model = require('../models/aura_hr_kpi.model');
const controller = require('../controllers/aura_hr_kpi.controller');

module.exports = createRouter(controller, model);
