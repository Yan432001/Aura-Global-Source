const createRouter = require('../core/createRouter');
const model = require('../models/aura_pawn_rates.model');
const controller = require('../controllers/aura_pawn_rates.controller');

module.exports = createRouter(controller, model);
