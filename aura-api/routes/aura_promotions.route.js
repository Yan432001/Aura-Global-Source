const createRouter = require('../core/createRouter');
const model = require('../models/aura_promotions.model');
const controller = require('../controllers/aura_promotions.controller');

module.exports = createRouter(controller, model);
