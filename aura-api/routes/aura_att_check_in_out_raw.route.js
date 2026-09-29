const createRouter = require('../core/createRouter');
const model = require('../models/aura_att_check_in_out_raw.model');
const controller = require('../controllers/aura_att_check_in_out_raw.controller');

module.exports = createRouter(controller, model);
