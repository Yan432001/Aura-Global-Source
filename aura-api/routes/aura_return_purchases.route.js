const createRouter = require('../core/createRouter');
const model = require('../models/aura_return_purchases.model');
const controller = require('../controllers/aura_return_purchases.controller');

module.exports = createRouter(controller, model);
