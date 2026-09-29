const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_feestype.model');
const controller = require('../controllers/aura_sh_feestype.controller');

module.exports = createRouter(controller, model);
