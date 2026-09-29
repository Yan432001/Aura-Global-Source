const createRouter = require('../core/createRouter');
const model = require('../models/aura_debit_note.model');
const controller = require('../controllers/aura_debit_note.controller');

module.exports = createRouter(controller, model);
