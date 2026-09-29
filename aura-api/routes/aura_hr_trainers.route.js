const createRouter = require('../core/createRouter');
const model = require('../models/aura_hr_trainers.model');
const controller = require('../controllers/aura_hr_trainers.controller');

module.exports = createRouter(controller, model);
