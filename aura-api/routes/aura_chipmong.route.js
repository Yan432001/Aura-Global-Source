const createRouter = require('../core/createRouter');
const model = require('../models/aura_chipmong.model');
const controller = require('../controllers/aura_chipmong.controller');

module.exports = createRouter(controller, model);
