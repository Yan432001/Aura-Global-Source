const createRouter = require('../core/createRouter');
const model = require('../models/aura_leads.model');
const controller = require('../controllers/aura_leads.controller');

module.exports = createRouter(controller, model);
