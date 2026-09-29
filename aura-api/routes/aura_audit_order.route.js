const createRouter = require('../core/createRouter');
const model = require('../models/aura_audit_order.model');
const controller = require('../controllers/aura_audit_order.controller');

module.exports = createRouter(controller, model);
