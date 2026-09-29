const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_tax_declaration",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"date","type":"timestamp","auto":false,"nullable":false,"hasDefault":true},
    {"name":"type","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"sale_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"reference","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"created_by","type":"int","auto":false,"nullable":true,"hasDefault":true},
  ],
});
