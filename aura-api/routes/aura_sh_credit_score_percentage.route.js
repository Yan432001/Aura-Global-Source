const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_credit_score_percentage.model');
const controller = require('../controllers/aura_sh_credit_score_percentage.controller');

module.exports = createRouter(controller, model);
