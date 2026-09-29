const createRouter = require('../core/createRouter');
const model = require('../models/aura_multi_transfer.model');
const controller = require('../controllers/aura_multi_transfer.controller');

module.exports = createRouter(controller, model);
