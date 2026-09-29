const createRouter = require('../core/createRouter');
const model = require('../models/aura_gl_charts.model');
const controller = require('../controllers/aura_gl_charts.controller');

module.exports = createRouter(controller, model);
