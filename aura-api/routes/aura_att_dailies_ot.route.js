const createRouter = require('../core/createRouter');
const model = require('../models/aura_att_dailies_ot.model');
const controller = require('../controllers/aura_att_dailies_ot.controller');

module.exports = createRouter(controller, model);
