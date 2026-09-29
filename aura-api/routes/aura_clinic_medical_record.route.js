const createRouter = require('../core/createRouter');
const model = require('../models/aura_clinic_medical_record.model');
const controller = require('../controllers/aura_clinic_medical_record.controller');

module.exports = createRouter(controller, model);
