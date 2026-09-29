const createRouter = require('../core/createRouter');
const model = require('../models/aura_brands.model');
const controller = require('../controllers/aura_brands.controller');

module.exports = createRouter(controller, model);
