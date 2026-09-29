const createRouter = require('../core/createRouter');
const model = require('../models/aura_transfers.model');
const controller = require('../controllers/aura_transfers.controller');

module.exports = createRouter(controller, model);
