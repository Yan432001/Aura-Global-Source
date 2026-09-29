const createRouter = require('../core/createRouter');
const model = require('../models/aura_sale_targets.model');
const controller = require('../controllers/aura_sale_targets.controller');

module.exports = createRouter(controller, model);
