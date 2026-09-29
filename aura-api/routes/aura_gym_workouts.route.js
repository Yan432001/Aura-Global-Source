const createRouter = require('../core/createRouter');
const model = require('../models/aura_gym_workouts.model');
const controller = require('../controllers/aura_gym_workouts.controller');

module.exports = createRouter(controller, model);
