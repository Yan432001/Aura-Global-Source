const createRouter = require('../core/createRouter');
const model = require('../models/aura_suspended_bills.model');
const controller = require('../controllers/aura_suspended_bills.controller');

module.exports = createRouter(controller, model);
