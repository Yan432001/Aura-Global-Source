const createRouter = require('../core/createRouter');
const model = require('../models/aura_pay_nssf.model');
const controller = require('../controllers/aura_pay_nssf.controller');

module.exports = createRouter(controller, model);
