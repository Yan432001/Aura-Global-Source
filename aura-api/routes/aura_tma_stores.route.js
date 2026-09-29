const createRouter = require('../core/createRouter');
const model = require('../models/aura_tma_stores.model');
const controller = require('../controllers/aura_tma_stores.controller');

module.exports = createRouter(controller, model);
