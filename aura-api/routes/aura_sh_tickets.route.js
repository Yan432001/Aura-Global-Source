const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_tickets.model');
const controller = require('../controllers/aura_sh_tickets.controller');

module.exports = createRouter(controller, model);
