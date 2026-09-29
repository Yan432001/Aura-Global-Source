const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sale_targets",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"biller_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"staff_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"start_date","type":"date","auto":false,"nullable":true,"hasDefault":true},
    {"name":"end_date","type":"date","auto":false,"nullable":true,"hasDefault":true},
    {"name":"amount","type":"decimal","auto":false,"nullable":false,"hasDefault":false},
    {"name":"multi_zone","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"description","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
  ],
});
