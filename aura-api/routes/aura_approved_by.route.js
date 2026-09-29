const createRouter = require('../core/createRouter');
const model = require('../models/aura_approved_by.model');
const controller = require('../controllers/aura_approved_by.controller');

module.exports = createRouter(controller, model);
