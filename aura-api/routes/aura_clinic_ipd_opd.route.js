const createRouter = require('../core/createRouter');
const model = require('../models/aura_clinic_ipd_opd.model');
const controller = require('../controllers/aura_clinic_ipd_opd.controller');

module.exports = createRouter(controller, model);
