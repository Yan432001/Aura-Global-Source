const createRouter = require('../core/createRouter');
const model = require('../models/aura_member_cards.model');
const controller = require('../controllers/aura_member_cards.controller');

module.exports = createRouter(controller, model);
