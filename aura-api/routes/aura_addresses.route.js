const createRouter = require('../core/createRouter');
const model = require('../models/aura_addresses.model');
const controller = require('../controllers/aura_addresses.controller');

module.exports = createRouter(controller, model);
