const createRouter = require('../core/createRouter');
const model = require('../models/aura_pay_additions.model');
const controller = require('../controllers/aura_pay_additions.controller');

module.exports = createRouter(controller, model);
