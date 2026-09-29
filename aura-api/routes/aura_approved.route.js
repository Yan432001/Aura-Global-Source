const createRouter = require('../core/createRouter');
const model = require('../models/aura_approved.model');
const controller = require('../controllers/aura_approved.controller');

module.exports = createRouter(controller, model);
