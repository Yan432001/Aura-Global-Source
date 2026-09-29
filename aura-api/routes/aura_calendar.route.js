const createRouter = require('../core/createRouter');
const model = require('../models/aura_calendar.model');
const controller = require('../controllers/aura_calendar.controller');

module.exports = createRouter(controller, model);
