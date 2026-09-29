const createRouter = require('../core/createRouter');
const model = require('../models/aura_att_take_leave_employees.model');
const controller = require('../controllers/aura_att_take_leave_employees.controller');

module.exports = createRouter(controller, model);
