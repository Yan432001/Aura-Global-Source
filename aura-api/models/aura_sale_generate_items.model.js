const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sale_generate_items",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"generate_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"sale_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"product_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"product_code","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"product_name","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
  ],
});
