const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_skins",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"customer_id","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"target_type","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"amount","type":"decimal","auto":false,"nullable":true,"hasDefault":true},
    {"name":"start_date","type":"date","auto":false,"nullable":true,"hasDefault":true},
    {"name":"end_date","type":"date","auto":false,"nullable":true,"hasDefault":true},
    {"name":"product","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"commission","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"status","type":"int","auto":false,"nullable":true,"hasDefault":true},
  ],
});
