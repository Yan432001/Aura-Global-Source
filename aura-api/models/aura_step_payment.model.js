const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_step_payment",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"sale_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"user_id","type":"tinyint","auto":false,"nullable":true,"hasDefault":true},
    {"name":"customer_id","type":"tinyint","auto":false,"nullable":true,"hasDefault":true},
    {"name":"payment_id","type":"tinyint","auto":false,"nullable":false,"hasDefault":false},
    {"name":"reference","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"pay_date","type":"date","auto":false,"nullable":true,"hasDefault":true},
    {"name":"monthly_payment","type":"decimal","auto":false,"nullable":true,"hasDefault":true},
    {"name":"principal","type":"decimal","auto":false,"nullable":true,"hasDefault":true},
    {"name":"interest","type":"decimal","auto":false,"nullable":true,"hasDefault":true},
    {"name":"balance","type":"decimal","auto":false,"nullable":true,"hasDefault":true},
    {"name":"status","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"paid","type":"decimal","auto":false,"nullable":true,"hasDefault":true},
    {"name":"register_date","type":"timestamp","auto":false,"nullable":true,"hasDefault":true},
    {"name":"warehouse_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
  ],
});
