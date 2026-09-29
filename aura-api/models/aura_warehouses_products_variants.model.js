const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_warehouses_products_variants",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"option_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"product_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"warehouse_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"quantity","type":"decimal","auto":false,"nullable":false,"hasDefault":false},
    {"name":"weight","type":"double","auto":false,"nullable":true,"hasDefault":true},
    {"name":"rack","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
  ],
});
