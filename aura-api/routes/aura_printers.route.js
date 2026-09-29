const createRouter = require('../core/createRouter');
const model = require('../models/aura_printers.model');
const controller = require('../controllers/aura_printers.controller');

module.exports = createRouter(controller, model);
