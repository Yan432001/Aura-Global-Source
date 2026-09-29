const createRouter = require('../core/createRouter');
const model = require('../models/aura_purchases.model');
const controller = require('../controllers/aura_purchases.controller');

module.exports = createRouter(controller, model);
