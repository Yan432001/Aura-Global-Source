const createRouter = require('../core/createRouter');
const model = require('../models/aura_projects_vendors.model');
const controller = require('../controllers/aura_projects_vendors.controller');

module.exports = createRouter(controller, model);
