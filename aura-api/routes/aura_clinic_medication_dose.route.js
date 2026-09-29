const createRouter = require('../core/createRouter');
const model = require('../models/aura_clinic_medication_dose.model');
const controller = require('../controllers/aura_clinic_medication_dose.controller');

module.exports = createRouter(controller, model);
