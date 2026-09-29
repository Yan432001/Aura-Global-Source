const createRouter = require('../core/createRouter');
const model = require('../models/aura_boards.model');
const controller = require('../controllers/aura_boards.controller');

module.exports = createRouter(controller, model);
