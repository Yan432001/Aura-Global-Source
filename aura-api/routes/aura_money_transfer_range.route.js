const createRouter = require('../core/createRouter');
const model = require('../models/aura_money_transfer_range.model');
const controller = require('../controllers/aura_money_transfer_range.controller');

module.exports = createRouter(controller, model);
