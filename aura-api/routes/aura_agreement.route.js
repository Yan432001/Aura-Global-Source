const createRouter = require('../core/createRouter');
const model = require('../models/aura_agreement.model');
const controller = require('../controllers/aura_agreement.controller');

module.exports = createRouter(controller, model);
