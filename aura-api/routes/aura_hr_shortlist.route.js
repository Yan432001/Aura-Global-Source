const createRouter = require('../core/createRouter');
const model = require('../models/aura_hr_shortlist.model');
const controller = require('../controllers/aura_hr_shortlist.controller');

module.exports = createRouter(controller, model);
