const createRouter = require('../core/createRouter');
const model = require('../models/aura_boms.model');
const controller = require('../controllers/aura_boms.controller');

module.exports = createRouter(controller, model);
