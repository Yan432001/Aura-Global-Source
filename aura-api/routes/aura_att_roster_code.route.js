const createRouter = require('../core/createRouter');
const model = require('../models/aura_att_roster_code.model');
const controller = require('../controllers/aura_att_roster_code.controller');

module.exports = createRouter(controller, model);
