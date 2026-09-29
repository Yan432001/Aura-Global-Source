const createRouter = require('../core/createRouter');
const model = require('../models/aura_companies.model');
const controller = require('../controllers/aura_companies.controller');

module.exports = createRouter(controller, model);
