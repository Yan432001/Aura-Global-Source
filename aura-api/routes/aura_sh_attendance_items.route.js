const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_attendance_items.model');
const controller = require('../controllers/aura_sh_attendance_items.controller');

module.exports = createRouter(controller, model);
