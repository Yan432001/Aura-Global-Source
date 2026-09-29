const createRouter = require('../core/createRouter');
const model = require('../models/aura_users_bank_account.model');
const controller = require('../controllers/aura_users_bank_account.controller');

module.exports = createRouter(controller, model);
