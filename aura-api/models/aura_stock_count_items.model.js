const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_stock_count_items",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"stock_count_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"date_time","type":"datetime","auto":false,"nullable":true,"hasDefault":true},
    {"name":"product_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"product_code","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"product_name","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"product_variant","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"product_variant_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"expected","type":"decimal","auto":false,"nullable":false,"hasDefault":false},
    {"name":"counted","type":"decimal","auto":false,"nullable":false,"hasDefault":false},
    {"name":"cost","type":"decimal","auto":false,"nullable":true,"hasDefault":true},
    {"name":"status","type":"int","auto":false,"nullable":false,"hasDefault":true},
    {"name":"expiry","type":"date","auto":false,"nullable":true,"hasDefault":true},
  ],
});
