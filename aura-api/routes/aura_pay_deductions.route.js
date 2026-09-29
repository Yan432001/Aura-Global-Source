const createRouter = require('../core/createRouter');
const model = require('../models/aura_pay_deductions.model');
const controller = require('../controllers/aura_pay_deductions.controller');

module.exports = createRouter(controller, model);
