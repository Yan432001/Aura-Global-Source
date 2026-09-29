const createRouter = require('../core/createRouter');
const model = require('../models/aura_return_items.model');
const controller = require('../controllers/aura_return_items.controller');

module.exports = createRouter(controller, model);
