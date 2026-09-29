const createRouter = require('../core/createRouter');
const model = require('../models/aura_con_trucks.model');
const controller = require('../controllers/aura_con_trucks.controller');

module.exports = createRouter(controller, model);
