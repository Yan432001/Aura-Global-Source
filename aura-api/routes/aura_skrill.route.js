const createRouter = require('../core/createRouter');
const model = require('../models/aura_skrill.model');
const controller = require('../controllers/aura_skrill.controller');

module.exports = createRouter(controller, model);
