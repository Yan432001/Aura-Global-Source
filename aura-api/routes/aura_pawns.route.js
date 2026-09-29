const createRouter = require('../core/createRouter');
const model = require('../models/aura_pawns.model');
const controller = require('../controllers/aura_pawns.controller');

module.exports = createRouter(controller, model);
