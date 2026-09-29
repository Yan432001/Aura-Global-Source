const createRouter = require('../core/createRouter');
const model = require('../models/aura_con_missions.model');
const controller = require('../controllers/aura_con_missions.controller');

module.exports = createRouter(controller, model);
