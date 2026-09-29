const createRouter = require('../core/createRouter');
const model = require('../models/aura_reservation.model');
const controller = require('../controllers/aura_reservation.controller');

module.exports = createRouter(controller, model);
