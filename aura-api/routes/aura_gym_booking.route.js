const createRouter = require('../core/createRouter');
const model = require('../models/aura_gym_booking.model');
const controller = require('../controllers/aura_gym_booking.controller');

module.exports = createRouter(controller, model);
