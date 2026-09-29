const createRouter = require('../core/createRouter');
const model = require('../models/aura_projects_plan_items.model');
const controller = require('../controllers/aura_projects_plan_items.controller');

module.exports = createRouter(controller, model);
