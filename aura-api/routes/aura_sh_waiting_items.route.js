const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_waiting_items.model');
const controller = require('../controllers/aura_sh_waiting_items.controller');

module.exports = createRouter(controller, model);
