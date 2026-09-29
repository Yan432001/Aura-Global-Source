const createRouter = require('../core/createRouter');
const model = require('../models/aura_audit_booking.model');
const controller = require('../controllers/aura_audit_booking.controller');

module.exports = createRouter(controller, model);
