const createRouter = require('../core/createRouter');
const model = require('../models/aura_sales_rank_commission.model');
const controller = require('../controllers/aura_sales_rank_commission.controller');

module.exports = createRouter(controller, model);
