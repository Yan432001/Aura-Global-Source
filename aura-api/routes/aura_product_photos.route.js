const createRouter = require('../core/createRouter');
const model = require('../models/aura_product_photos.model');
const controller = require('../controllers/aura_product_photos.controller');

module.exports = createRouter(controller, model);
