const createRouter = require('../core/createRouter');
const model = require('../models/aura_account_transfer.model');
const controller = require('../controllers/aura_account_transfer.controller');

module.exports = createRouter(controller, model);
