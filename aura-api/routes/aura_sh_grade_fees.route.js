const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_grade_fees.model');
const controller = require('../controllers/aura_sh_grade_fees.controller');

module.exports = createRouter(controller, model);
