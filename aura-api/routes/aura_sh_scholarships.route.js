const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_scholarships.model');
const controller = require('../controllers/aura_sh_scholarships.controller');

module.exports = createRouter(controller, model);
