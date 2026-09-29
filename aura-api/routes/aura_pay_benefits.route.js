const createRouter = require('../core/createRouter');
const model = require('../models/aura_pay_benefits.model');
const controller = require('../controllers/aura_pay_benefits.controller');

module.exports = createRouter(controller, model);
