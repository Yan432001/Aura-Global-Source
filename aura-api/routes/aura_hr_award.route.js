const createRouter = require('../core/createRouter');
const model = require('../models/aura_hr_award.model');
const controller = require('../controllers/aura_hr_award.controller');

module.exports = createRouter(controller, model);
