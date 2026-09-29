const createRouter = require('../core/createRouter');
const model = require('../models/aura_customer_groups.model');
const controller = require('../controllers/aura_customer_groups.controller');

module.exports = createRouter(controller, model);
