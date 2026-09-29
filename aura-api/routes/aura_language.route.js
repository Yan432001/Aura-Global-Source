const createRouter = require('../core/createRouter');
const model = require('../models/aura_language.model');
const controller = require('../controllers/aura_language.controller');

module.exports = createRouter(controller, model);
