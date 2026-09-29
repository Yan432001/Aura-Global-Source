const createRouter = require('../core/createRouter');
const model = require('../models/aura_audit_trail_order_item.model');
const controller = require('../controllers/aura_audit_trail_order_item.controller');

module.exports = createRouter(controller, model);
