const createRouter = require('../core/createRouter');
const model = require('../models/aura_savings.model');
const controller = require('../controllers/aura_savings.controller');

module.exports = createRouter(controller, model);
