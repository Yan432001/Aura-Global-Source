const createRouter = require('../core/createRouter');
const model = require('../models/aura_con_moving_waiting_items.model');
const controller = require('../controllers/aura_con_moving_waiting_items.controller');

module.exports = createRouter(controller, model);
