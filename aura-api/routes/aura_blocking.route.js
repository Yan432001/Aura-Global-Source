const createRouter = require('../core/createRouter');
const model = require('../models/aura_blocking.model');
const controller = require('../controllers/aura_blocking.controller');

module.exports = createRouter(controller, model);
