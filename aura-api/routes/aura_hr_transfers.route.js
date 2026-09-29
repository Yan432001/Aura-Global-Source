const createRouter = require('../core/createRouter');
const model = require('../models/aura_hr_transfers.model');
const controller = require('../controllers/aura_hr_transfers.controller');

module.exports = createRouter(controller, model);
