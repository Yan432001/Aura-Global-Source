const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_ticket_responses.model');
const controller = require('../controllers/aura_sh_ticket_responses.controller');

module.exports = createRouter(controller, model);
