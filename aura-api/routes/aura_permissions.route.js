const createRouter = require('../core/createRouter');
const model = require('../models/aura_permissions.model');
const controller = require('../controllers/aura_permissions.controller');

module.exports = createRouter(controller, model);
