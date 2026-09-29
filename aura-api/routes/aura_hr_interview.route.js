const createRouter = require('../core/createRouter');
const model = require('../models/aura_hr_interview.model');
const controller = require('../controllers/aura_hr_interview.controller');

module.exports = createRouter(controller, model);
