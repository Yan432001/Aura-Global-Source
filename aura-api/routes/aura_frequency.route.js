const createRouter = require('../core/createRouter');
const model = require('../models/aura_frequency.model');
const controller = require('../controllers/aura_frequency.controller');

module.exports = createRouter(controller, model);
