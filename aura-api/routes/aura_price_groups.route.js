const createRouter = require('../core/createRouter');
const model = require('../models/aura_price_groups.model');
const controller = require('../controllers/aura_price_groups.controller');

module.exports = createRouter(controller, model);
