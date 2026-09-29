const createRouter = require('../core/createRouter');
const model = require('../models/aura_convert_items.model');
const controller = require('../controllers/aura_convert_items.controller');

module.exports = createRouter(controller, model);
