const createRouter = require('../core/createRouter');
const model = require('../models/aura_coupon.model');
const controller = require('../controllers/aura_coupon.controller');

module.exports = createRouter(controller, model);
