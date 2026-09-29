const createRouter = require('../core/createRouter');
const model = require('../models/aura_att_approve_attedances.model');
const controller = require('../controllers/aura_att_approve_attedances.controller');

module.exports = createRouter(controller, model);
