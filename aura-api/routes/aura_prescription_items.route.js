const createRouter = require('../core/createRouter');
const model = require('../models/aura_prescription_items.model');
const controller = require('../controllers/aura_prescription_items.controller');

module.exports = createRouter(controller, model);
