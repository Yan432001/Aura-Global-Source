const createRouter = require('../core/createRouter');
const model = require('../models/aura_users.model');
const controller = require('../controllers/aura_users.controller');

module.exports = createRouter(controller, model);
