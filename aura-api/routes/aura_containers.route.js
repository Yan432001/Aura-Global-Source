const createRouter = require('../core/createRouter');
const model = require('../models/aura_containers.model');
const controller = require('../controllers/aura_containers.controller');

module.exports = createRouter(controller, model);
