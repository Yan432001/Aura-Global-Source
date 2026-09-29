const createRouter = require('../core/createRouter');
const model = require('../models/aura_att_ot_policy_working_days.model');
const controller = require('../controllers/aura_att_ot_policy_working_days.controller');

module.exports = createRouter(controller, model);
