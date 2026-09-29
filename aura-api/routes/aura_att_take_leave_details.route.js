const createRouter = require('../core/createRouter');
const model = require('../models/aura_att_take_leave_details.model');
const controller = require('../controllers/aura_att_take_leave_details.controller');

module.exports = createRouter(controller, model);
