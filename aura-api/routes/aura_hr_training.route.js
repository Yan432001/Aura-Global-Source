const createRouter = require('../core/createRouter');
const model = require('../models/aura_hr_training.model');
const controller = require('../controllers/aura_hr_training.controller');

module.exports = createRouter(controller, model);
