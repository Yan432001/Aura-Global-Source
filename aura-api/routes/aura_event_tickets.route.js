const createRouter = require('../core/createRouter');
const model = require('../models/aura_event_tickets.model');
const controller = require('../controllers/aura_event_tickets.controller');

module.exports = createRouter(controller, model);
