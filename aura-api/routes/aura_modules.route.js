const createRouter = require('../core/createRouter');
const model = require('../models/aura_modules.model');
const controller = require('../controllers/aura_modules.controller');

module.exports = createRouter(controller, model);
