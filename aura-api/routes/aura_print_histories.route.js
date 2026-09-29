const createRouter = require('../core/createRouter');
const model = require('../models/aura_print_histories.model');
const controller = require('../controllers/aura_print_histories.controller');

module.exports = createRouter(controller, model);
