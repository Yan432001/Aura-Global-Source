const createRouter = require('../core/createRouter');
const model = require('../models/aura_custom_field.model');
const controller = require('../controllers/aura_custom_field.controller');

module.exports = createRouter(controller, model);
