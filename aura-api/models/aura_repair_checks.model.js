const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_repair_checks",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"date","type":"datetime","auto":false,"nullable":true,"hasDefault":true},
    {"name":"reference_no","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"repair_reference_no","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"customer_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"customer","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"phone","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"warehouse_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"biller_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"biller","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"note","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"brand_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"model_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"machine_type_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"imei_number","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"status","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"created_by","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"updated_at","type":"timestamp","auto":false,"nullable":true,"hasDefault":true},
    {"name":"updated_by","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"attachment","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
  ],
});
