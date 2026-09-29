const createRouter = require('../core/createRouter');
const model = require('../models/aura_notifications.model');
const controller = require('../controllers/aura_notifications.controller');

module.exports = createRouter(controller, model);
