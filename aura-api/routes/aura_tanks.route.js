const createRouter = require('../core/createRouter');
const model = require('../models/aura_tanks.model');
const controller = require('../controllers/aura_tanks.controller');

module.exports = createRouter(controller, model);
