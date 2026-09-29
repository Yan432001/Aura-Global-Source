const createRouter = require('../core/createRouter');
const model = require('../models/aura_bussiness_type.model');
const controller = require('../controllers/aura_bussiness_type.controller');

module.exports = createRouter(controller, model);
