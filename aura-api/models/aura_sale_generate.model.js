const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sale_generate",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"date","type":"datetime","auto":false,"nullable":false,"hasDefault":true},
    {"name":"reference_no","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"biller_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"month","type":"char","auto":false,"nullable":true,"hasDefault":true},
    {"name":"description","type":"text","auto":false,"nullable":false,"hasDefault":false},
    {"name":"total_invoice","type":"int","auto":false,"nullable":false,"hasDefault":true},
    {"name":"status","type":"tinyint","auto":false,"nullable":true,"hasDefault":true},
    {"name":"saleman_by","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"zone","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"created_by","type":"int","auto":false,"nullable":true,"hasDefault":true},
  ],
});
