const createRouter = require('../core/createRouter');
const model = require('../models/aura_audit_bill.model');
const controller = require('../controllers/aura_audit_bill.controller');

module.exports = createRouter(controller, model);
