const createRouter = require('../core/createRouter');
const model = require('../models/aura_promos.model');
const controller = require('../controllers/aura_promos.controller');

module.exports = createRouter(controller, model);
