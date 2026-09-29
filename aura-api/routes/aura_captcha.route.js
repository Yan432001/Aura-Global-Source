const createRouter = require('../core/createRouter');
const model = require('../models/aura_captcha.model');
const controller = require('../controllers/aura_captcha.controller');

module.exports = createRouter(controller, model);
