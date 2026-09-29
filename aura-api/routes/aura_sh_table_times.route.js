const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_table_times.model');
const controller = require('../controllers/aura_sh_table_times.controller');

module.exports = createRouter(controller, model);
