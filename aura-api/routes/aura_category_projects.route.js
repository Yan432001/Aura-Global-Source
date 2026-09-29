const createRouter = require('../core/createRouter');
const model = require('../models/aura_category_projects.model');
const controller = require('../controllers/aura_category_projects.controller');

module.exports = createRouter(controller, model);
