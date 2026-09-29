const createRouter = require('../core/createRouter');
const model = require('../models/aura_installments_penalty.model');
const controller = require('../controllers/aura_installments_penalty.controller');

module.exports = createRouter(controller, model);
