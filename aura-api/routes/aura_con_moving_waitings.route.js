const createRouter = require('../core/createRouter');
const model = require('../models/aura_con_moving_waitings.model');
const controller = require('../controllers/aura_con_moving_waitings.controller');

module.exports = createRouter(controller, model);
