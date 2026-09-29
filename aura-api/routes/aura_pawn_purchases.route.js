const createRouter = require('../core/createRouter');
const model = require('../models/aura_pawn_purchases.model');
const controller = require('../controllers/aura_pawn_purchases.controller');

module.exports = createRouter(controller, model);
