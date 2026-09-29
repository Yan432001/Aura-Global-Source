const createRouter = require('../core/createRouter');
const model = require('../models/aura_installment_assigns.model');
const controller = require('../controllers/aura_installment_assigns.controller');

module.exports = createRouter(controller, model);
