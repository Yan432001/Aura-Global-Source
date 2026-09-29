const createRouter = require('../core/createRouter');
const model = require('../models/aura_att_attedances.model');
const controller = require('../controllers/aura_att_attedances.controller');

module.exports = createRouter(controller, model);
