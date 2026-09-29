const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_warehouses_products",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"product_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"warehouse_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"quantity","type":"decimal","auto":false,"nullable":false,"hasDefault":true},
    {"name":"weight","type":"double","auto":false,"nullable":false,"hasDefault":true},
    {"name":"rack","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"rack_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"avg_cost","type":"decimal","auto":false,"nullable":false,"hasDefault":true},
    {"name":"qty_alert","type":"decimal","auto":false,"nullable":true,"hasDefault":true},
  ],
});
