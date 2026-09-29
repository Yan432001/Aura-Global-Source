const createRouter = require('../core/createRouter');
const model = require('../models/aura_pay_severances.model');
const controller = require('../controllers/aura_pay_severances.controller');

module.exports = createRouter(controller, model);
