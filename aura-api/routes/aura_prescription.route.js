const createRouter = require('../core/createRouter');
const model = require('../models/aura_prescription.model');
const controller = require('../controllers/aura_prescription.controller');

module.exports = createRouter(controller, model);
