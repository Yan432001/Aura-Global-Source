const createRouter = require('../core/createRouter');
const model = require('../models/aura_share_commissions.model');
const controller = require('../controllers/aura_share_commissions.controller');

module.exports = createRouter(controller, model);
