const createRouter = require('../core/createRouter');
const model = require('../models/aura_bank_reconsile_items.model');
const controller = require('../controllers/aura_bank_reconsile_items.controller');

module.exports = createRouter(controller, model);
