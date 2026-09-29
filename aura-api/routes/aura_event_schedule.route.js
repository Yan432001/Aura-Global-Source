const createRouter = require('../core/createRouter');
const model = require('../models/aura_event_schedule.model');
const controller = require('../controllers/aura_event_schedule.controller');

module.exports = createRouter(controller, model);
