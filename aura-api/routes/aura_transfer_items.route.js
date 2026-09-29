const createRouter = require('../core/createRouter');
const model = require('../models/aura_transfer_items.model');
const controller = require('../controllers/aura_transfer_items.controller');

module.exports = createRouter(controller, model);
