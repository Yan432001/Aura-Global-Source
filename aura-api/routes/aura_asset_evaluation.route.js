const createRouter = require('../core/createRouter');
const model = require('../models/aura_asset_evaluation.model');
const controller = require('../controllers/aura_asset_evaluation.controller');

module.exports = createRouter(controller, model);
