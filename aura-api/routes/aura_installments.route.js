const createRouter = require('../core/createRouter');
const model = require('../models/aura_installments.model');
const controller = require('../controllers/aura_installments.controller');

module.exports = createRouter(controller, model);
