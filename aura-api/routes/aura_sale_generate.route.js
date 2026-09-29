const createRouter = require('../core/createRouter');
const model = require('../models/aura_sale_generate.model');
const controller = require('../controllers/aura_sale_generate.controller');

module.exports = createRouter(controller, model);
