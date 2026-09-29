const createRouter = require('../core/createRouter');
const model = require('../models/aura_promotion_categories.model');
const controller = require('../controllers/aura_promotion_categories.controller');

module.exports = createRouter(controller, model);
