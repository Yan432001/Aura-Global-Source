const createRouter = require('../core/createRouter');
const model = require('../models/aura_account_journal_items.model');
const controller = require('../controllers/aura_account_journal_items.controller');

module.exports = createRouter(controller, model);
