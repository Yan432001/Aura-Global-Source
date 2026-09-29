const createRouter = require('../core/createRouter');
const model = require('../models/aura_projects_milestones.model');
const controller = require('../controllers/aura_projects_milestones.controller');

module.exports = createRouter(controller, model);
