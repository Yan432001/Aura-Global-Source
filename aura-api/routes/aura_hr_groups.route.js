const createRouter = require('../core/createRouter');
const model = require('../models/aura_hr_groups.model');
const controller = require('../controllers/aura_hr_groups.controller');

module.exports = createRouter(controller, model);
