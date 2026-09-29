const createRouter = require('../core/createRouter');
const model = require('../models/aura_quotes.model');
const controller = require('../controllers/aura_quotes.controller');

module.exports = createRouter(controller, model);
