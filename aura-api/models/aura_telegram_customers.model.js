const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_telegram_customers",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"telegram_id","type":"bigint","auto":false,"nullable":false,"hasDefault":false},
    {"name":"biller_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"customer_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"first_name","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"last_name","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"username","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"phone","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"created_at","type":"timestamp","auto":false,"nullable":false,"hasDefault":true},
  ],
});
