const createRouter = require('../core/createRouter');
const model = require('../models/aura_con_mission_types.model');
const controller = require('../controllers/aura_con_mission_types.controller');

module.exports = createRouter(controller, model);
