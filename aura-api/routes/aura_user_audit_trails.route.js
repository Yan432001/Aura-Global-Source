const createRouter = require('../core/createRouter');
const model = require('../models/aura_user_audit_trails.model');
const controller = require('../controllers/aura_user_audit_trails.controller');

module.exports = createRouter(controller, model);
