const createRouter = require('../core/createRouter');
const model = require('../models/aura_menu.model');
const controller = require('../controllers/aura_menu.controller');

module.exports = createRouter(controller, model);
