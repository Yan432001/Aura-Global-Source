const createRouter = require('../core/createRouter');
const model = require('../models/aura_att_day_off_items.model');
const controller = require('../controllers/aura_att_day_off_items.controller');

module.exports = createRouter(controller, model);
