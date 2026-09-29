const createRouter = require('../core/createRouter');
const model = require('../models/aura_bank_reconsile.model');
const controller = require('../controllers/aura_bank_reconsile.controller');

module.exports = createRouter(controller, model);
