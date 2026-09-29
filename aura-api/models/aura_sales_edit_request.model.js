const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sales_edit_request",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"sale_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"reference_no","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"sale_reference_no","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"date","type":"timestamp","auto":false,"nullable":false,"hasDefault":true},
    {"name":"updated_date","type":"datetime","auto":false,"nullable":true,"hasDefault":true},
    {"name":"updated_by","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"noted","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"note","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"warehouse_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"created_by","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"status","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"biller_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"attachment","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"active","type":"int","auto":false,"nullable":false,"hasDefault":true},
  ],
});
