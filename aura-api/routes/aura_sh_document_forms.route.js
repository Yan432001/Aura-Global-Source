const createRouter = require('../core/createRouter');
const model = require('../models/aura_sh_document_forms.model');
const controller = require('../controllers/aura_sh_document_forms.controller');

module.exports = createRouter(controller, model);
