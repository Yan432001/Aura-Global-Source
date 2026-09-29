const createRouter = require('../core/createRouter');
const model = require('../models/aura_customer_trucks.model');
const controller = require('../controllers/aura_customer_trucks.controller');

module.exports = createRouter(controller, model);
