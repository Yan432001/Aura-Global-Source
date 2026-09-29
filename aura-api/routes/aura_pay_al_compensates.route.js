const createRouter = require('../core/createRouter');
const model = require('../models/aura_pay_al_compensates.model');
const controller = require('../controllers/aura_pay_al_compensates.controller');

module.exports = createRouter(controller, model);
