const createRouter = require('../core/createRouter');
const model = require('../models/aura_floors.model');
const controller = require('../controllers/aura_floors.controller');

module.exports = createRouter(controller, model);
