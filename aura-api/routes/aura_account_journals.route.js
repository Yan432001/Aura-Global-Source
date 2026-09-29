const createRouter = require('../core/createRouter');
const model = require('../models/aura_account_journals.model');
const controller = require('../controllers/aura_account_journals.controller');

module.exports = createRouter(controller, model);
