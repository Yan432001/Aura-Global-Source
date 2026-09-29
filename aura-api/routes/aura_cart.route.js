const createRouter = require('../core/createRouter');
const model = require('../models/aura_cart.model');
const controller = require('../controllers/aura_cart.controller');

module.exports = createRouter(controller, model);
