const createRouter = require('../core/createRouter');
const model = require('../models/aura_att_devices.model');
const controller = require('../controllers/aura_att_devices.controller');

module.exports = createRouter(controller, model);
