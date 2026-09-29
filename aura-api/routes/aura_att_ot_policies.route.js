const createRouter = require('../core/createRouter');
const model = require('../models/aura_att_ot_policies.model');
const controller = require('../controllers/aura_att_ot_policies.controller');

module.exports = createRouter(controller, model);
