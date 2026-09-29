const createRouter = require('../core/createRouter');
const model = require('../models/aura_hr_id_cards.model');
const controller = require('../controllers/aura_hr_id_cards.controller');

module.exports = createRouter(controller, model);
