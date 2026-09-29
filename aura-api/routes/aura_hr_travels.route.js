const createRouter = require('../core/createRouter');
const model = require('../models/aura_hr_travels.model');
const controller = require('../controllers/aura_hr_travels.controller');

module.exports = createRouter(controller, model);
