const createRouter = require('../core/createRouter');
const model = require('../models/aura_pos_register.model');
const controller = require('../controllers/aura_pos_register.controller');

module.exports = createRouter(controller, model);
