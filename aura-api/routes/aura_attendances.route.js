const createRouter = require('../core/createRouter');
const model = require('../models/aura_attendances.model');
const controller = require('../controllers/aura_attendances.controller');

module.exports = createRouter(controller, model);
