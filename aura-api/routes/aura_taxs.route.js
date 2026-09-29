const createRouter = require('../core/createRouter');
const model = require('../models/aura_taxs.model');
const controller = require('../controllers/aura_taxs.controller');

module.exports = createRouter(controller, model);
