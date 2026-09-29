const createRouter = require('../core/createRouter');
const model = require('../models/aura_models.model');
const controller = require('../controllers/aura_models.controller');

module.exports = createRouter(controller, model);
