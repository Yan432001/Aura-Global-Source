const createRouter = require('../core/createRouter');
const model = require('../models/aura_consumers.model');
const controller = require('../controllers/aura_consumers.controller');

module.exports = createRouter(controller, model);
