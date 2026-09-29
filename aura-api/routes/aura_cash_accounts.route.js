const createRouter = require('../core/createRouter');
const model = require('../models/aura_cash_accounts.model');
const controller = require('../controllers/aura_cash_accounts.controller');

module.exports = createRouter(controller, model);
