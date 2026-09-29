const createRouter = require('../core/createRouter');
const model = require('../models/aura_clinic_op_categories.model');
const controller = require('../controllers/aura_clinic_op_categories.controller');

module.exports = createRouter(controller, model);
