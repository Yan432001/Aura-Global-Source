const createRouter = require('../core/createRouter');
const model = require('../models/aura_tax_declaration.model');
const controller = require('../controllers/aura_tax_declaration.controller');

module.exports = createRouter(controller, model);
