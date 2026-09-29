const createRouter = require('../core/createRouter');
const model = require('../models/aura_att_roster.model');
const controller = require('../controllers/aura_att_roster.controller');

module.exports = createRouter(controller, model);
