const createRouter = require('../core/createRouter');
const model = require('../models/aura_credit_note.model');
const controller = require('../controllers/aura_credit_note.controller');

module.exports = createRouter(controller, model);
