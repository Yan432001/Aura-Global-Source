const createRouter = require('../core/createRouter');
const model = require('../models/aura_projects_plan.model');
const controller = require('../controllers/aura_projects_plan.controller');

module.exports = createRouter(controller, model);
