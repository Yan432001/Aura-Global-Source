const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_credit_scores.model');
const controller = require('../controllers/aura_sh_credit_scores.controller');

module.exports = createRouter(controller, model);
