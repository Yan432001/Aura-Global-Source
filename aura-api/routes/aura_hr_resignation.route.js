const createRouter = require('../core/createRouter');
const model = require('../models/aura_hr_resignation.model');
const controller = require('../controllers/aura_hr_resignation.controller');

module.exports = createRouter(controller, model);
