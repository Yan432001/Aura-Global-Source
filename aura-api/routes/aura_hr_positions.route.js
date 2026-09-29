const createRouter = require('../core/createRouter');
const model = require('../models/aura_hr_positions.model');
const controller = require('../controllers/aura_hr_positions.controller');

module.exports = createRouter(controller, model);
