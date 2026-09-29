const createRouter = require('../core/createRouter');
const model = require('../models/aura_options.model');
const controller = require('../controllers/aura_options.controller');

module.exports = createRouter(controller, model);
