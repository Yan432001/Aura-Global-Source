const createRouter = require('../core/createRouter');
const model = require('../models/aura_clinic_pathology.model');
const controller = require('../controllers/aura_clinic_pathology.controller');

module.exports = createRouter(controller, model);
