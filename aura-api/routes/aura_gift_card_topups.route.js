const createRouter = require('../core/createRouter');
const model = require('../models/aura_gift_card_topups.model');
const controller = require('../controllers/aura_gift_card_topups.controller');

module.exports = createRouter(controller, model);
