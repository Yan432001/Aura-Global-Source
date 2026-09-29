const createRouter = require('../core/createRouter');
const model = require('../models/aura_projects.model');
const controller = require('../controllers/aura_projects.controller');

module.exports = createRouter(controller, model);
