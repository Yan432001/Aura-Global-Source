const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_rooms.model');
const controller = require('../controllers/aura_sh_rooms.controller');

module.exports = createRouter(controller, model);
