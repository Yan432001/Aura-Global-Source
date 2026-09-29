const createRouter = require('../core/createRouter');
const model = require('../models/aura_audit_blocking.model');
const controller = require('../controllers/aura_audit_blocking.controller');

module.exports = createRouter(controller, model);
