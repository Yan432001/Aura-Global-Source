const createRouter = require('../core/createRouter');
const model = require('../models/aura_att_take_leaves.model');
const controller = require('../controllers/aura_att_take_leaves.controller');

module.exports = createRouter(controller, model);
