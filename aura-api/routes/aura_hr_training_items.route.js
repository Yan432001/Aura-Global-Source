const createRouter = require('../core/createRouter');
const model = require('../models/aura_hr_training_items.model');
const controller = require('../controllers/aura_hr_training_items.controller');

module.exports = createRouter(controller, model);
