const createRouter = require('../core/createRouter');
const model = require('../models/aura_pay_severance_items.model');
const controller = require('../controllers/aura_pay_severance_items.controller');

module.exports = createRouter(controller, model);
