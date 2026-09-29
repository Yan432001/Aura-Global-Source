const createRouter = require('../core/createRouter');
const model = require('../models/aura_gym_workout_time.model');
const controller = require('../controllers/aura_gym_workout_time.controller');

module.exports = createRouter(controller, model);
