const createRouter = require('../core/createRouter');
const model = require('../models/aura_categories.model');
const controller = require('../controllers/aura_categories.controller');

module.exports = createRouter(controller, model);
