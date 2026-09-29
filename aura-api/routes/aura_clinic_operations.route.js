const createRouter = require('../core/createRouter');
const model = require('../models/aura_clinic_operations.model');
const controller = require('../controllers/aura_clinic_operations.controller');

module.exports = createRouter(controller, model);
