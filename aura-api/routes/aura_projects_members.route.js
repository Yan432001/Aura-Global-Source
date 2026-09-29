const createRouter = require('../core/createRouter');
const model = require('../models/aura_projects_members.model');
const controller = require('../controllers/aura_projects_members.controller');

module.exports = createRouter(controller, model);
