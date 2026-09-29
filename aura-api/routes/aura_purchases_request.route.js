const createRouter = require('../core/createRouter');
const model = require('../models/aura_purchases_request.model');
const controller = require('../controllers/aura_purchases_request.controller');

module.exports = createRouter(controller, model);
