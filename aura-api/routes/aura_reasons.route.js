const createRouter = require('../core/createRouter');
const model = require('../models/aura_reasons.model');
const controller = require('../controllers/aura_reasons.controller');

module.exports = createRouter(controller, model);
