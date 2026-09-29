const createRouter = require('../core/createRouter');
const model = require('../models/aura_projects_tasks.model');
const controller = require('../controllers/aura_projects_tasks.controller');

module.exports = createRouter(controller, model);
