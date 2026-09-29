const createRouter = require('../core/createRouter');
const model = require('../models/aura_gift_cards.model');
const controller = require('../controllers/aura_gift_cards.controller');

module.exports = createRouter(controller, model);
