const createRouter = require('../core/createRouter');
const model = require('../models/aura_wishlist.model');
const controller = require('../controllers/aura_wishlist.controller');

module.exports = createRouter(controller, model);
