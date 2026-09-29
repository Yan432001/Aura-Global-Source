const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_relationship_types.model');
const controller = require('../controllers/aura_sh_relationship_types.controller');

module.exports = createRouter(controller, model);
