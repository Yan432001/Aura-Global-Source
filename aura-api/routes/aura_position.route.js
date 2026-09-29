const createRouter = require('../core/createRouter');
const model = require('../models/aura_position.model');
const controller = require('../controllers/aura_position.controller');

module.exports = createRouter(controller, model);
