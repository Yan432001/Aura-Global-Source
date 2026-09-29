const createRouter = require('../core/createRouter');
const model = require('../models/aura_att_dailies.model');
const controller = require('../controllers/aura_att_dailies.controller');

module.exports = createRouter(controller, model);
