const createRouter = require('../core/createRouter');
const model = require('../models/aura_skins.model');
const controller = require('../controllers/aura_skins.controller');

module.exports = createRouter(controller, model);
