const createRouter = require('../core/createRouter');
const model = require('../models/aura_converts.model');
const controller = require('../controllers/aura_converts.controller');

module.exports = createRouter(controller, model);
