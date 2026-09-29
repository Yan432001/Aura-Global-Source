const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_savings_cancel_transactions",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"date","type":"datetime","auto":false,"nullable":true,"hasDefault":true},
    {"name":"reference_no","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"saving_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"transaction_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"transaction","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"amount","type":"double","auto":false,"nullable":true,"hasDefault":true},
    {"name":"type","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"note","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"comment","type":"text","auto":false,"nullable":true,"hasDefault":false},
  ],
});
