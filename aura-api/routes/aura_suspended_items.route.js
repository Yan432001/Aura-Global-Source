const createRouter = require('../core/createRouter');
const model = require('../models/aura_suspended_items.model');
const controller = require('../controllers/aura_suspended_items.controller');

module.exports = createRouter(controller, model);
