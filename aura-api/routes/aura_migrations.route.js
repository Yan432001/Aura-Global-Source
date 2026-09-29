const createRouter = require('../core/createRouter');
const model = require('../models/aura_migrations.model');
const controller = require('../controllers/aura_migrations.controller');

module.exports = createRouter(controller, model);
