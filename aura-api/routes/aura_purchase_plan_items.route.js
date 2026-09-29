const createRouter = require('../core/createRouter');
const model = require('../models/aura_purchase_plan_items.model');
const controller = require('../controllers/aura_purchase_plan_items.controller');

module.exports = createRouter(controller, model);
