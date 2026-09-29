const createRouter = require('../core/createRouter');
const model = require('../models/aura_account_transfer_item.model');
const controller = require('../controllers/aura_account_transfer_item.controller');

module.exports = createRouter(controller, model);
