const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_scores.model');
const controller = require('../controllers/aura_sh_scores.controller');

module.exports = createRouter(controller, model);
