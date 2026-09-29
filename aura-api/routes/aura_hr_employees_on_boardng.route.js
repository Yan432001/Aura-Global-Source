const createRouter = require('../core/createRouter');
const model = require('../models/aura_hr_employees_on_boardng.model');
const controller = require('../controllers/aura_hr_employees_on_boardng.controller');

module.exports = createRouter(controller, model);
