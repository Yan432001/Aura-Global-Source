const createRouter = require('../core/createRouter');
const model = require('../models/aura_truncate.model');
const controller = require('../controllers/aura_truncate.controller');

module.exports = createRouter(controller, model);
