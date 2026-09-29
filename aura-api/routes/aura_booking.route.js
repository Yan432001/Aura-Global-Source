const createRouter = require('../core/createRouter');
const model = require('../models/aura_booking.model');
const controller = require('../controllers/aura_booking.controller');

module.exports = createRouter(controller, model);
