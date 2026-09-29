const createRouter = require('../core/createRouter');
const model = require('../models/aura_quote_items.model');
const controller = require('../controllers/aura_quote_items.controller');

module.exports = createRouter(controller, model);
