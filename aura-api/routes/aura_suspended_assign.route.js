const createRouter = require('../core/createRouter');
const model = require('../models/aura_suspended_assign.model');
const controller = require('../controllers/aura_suspended_assign.controller');

module.exports = createRouter(controller, model);
