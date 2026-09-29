const createRouter = require('../core/createRouter');
const model = require('../models/aura_pages.model');
const controller = require('../controllers/aura_pages.controller');

module.exports = createRouter(controller, model);
