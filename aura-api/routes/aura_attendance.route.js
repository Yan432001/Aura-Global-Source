const createRouter = require('../core/createRouter');
const model = require('../models/aura_attendance.model');
const controller = require('../controllers/aura_attendance.controller');

module.exports = createRouter(controller, model);
