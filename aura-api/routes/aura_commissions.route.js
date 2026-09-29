const createRouter = require('../core/createRouter');
const model = require('../models/aura_commissions.model');
const controller = require('../controllers/aura_commissions.controller');

module.exports = createRouter(controller, model);
