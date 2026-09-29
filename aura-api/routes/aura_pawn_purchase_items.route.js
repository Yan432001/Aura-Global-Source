const createRouter = require('../core/createRouter');
const model = require('../models/aura_pawn_purchase_items.model');
const controller = require('../controllers/aura_pawn_purchase_items.controller');

module.exports = createRouter(controller, model);
