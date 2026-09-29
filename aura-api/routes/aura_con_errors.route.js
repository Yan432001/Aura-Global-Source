const createRouter = require('../core/createRouter');
const model = require('../models/aura_con_errors.model');
const controller = require('../controllers/aura_con_errors.controller');

module.exports = createRouter(controller, model);
