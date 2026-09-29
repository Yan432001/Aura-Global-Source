const createRouter = require('../core/createRouter');
const model = require('../models/aura_credit_note_items.model');
const controller = require('../controllers/aura_credit_note_items.controller');

module.exports = createRouter(controller, model);
