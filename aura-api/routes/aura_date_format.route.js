const createRouter = require('../core/createRouter');
const model = require('../models/aura_date_format.model');
const controller = require('../controllers/aura_date_format.controller');

module.exports = createRouter(controller, model);
