const createRouter = require('../core/createRouter');
const model = require('../models/aura_gl_trans.model');
const controller = require('../controllers/aura_gl_trans.controller');

module.exports = createRouter(controller, model);
