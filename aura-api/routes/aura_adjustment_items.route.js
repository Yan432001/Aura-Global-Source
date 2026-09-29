const createRouter = require('../core/createRouter');
const model = require('../models/aura_adjustment_items.model');
const controller = require('../controllers/aura_adjustment_items.controller');

module.exports = createRouter(controller, model);
