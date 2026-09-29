const createRouter = require('../core/createRouter');
const model = require('../models/aura_variants.model');
const controller = require('../controllers/aura_variants.controller');

module.exports = createRouter(controller, model);
