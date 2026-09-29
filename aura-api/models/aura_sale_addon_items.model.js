const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sale_addon_items",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"sale_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"sale_item_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"sale_product_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"product_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"product_code","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"product_name","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"product_type","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"warehouse_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"quantity","type":"decimal","auto":false,"nullable":false,"hasDefault":false},
    {"name":"net_unit_price","type":"decimal","auto":false,"nullable":false,"hasDefault":false},
    {"name":"unit_price","type":"decimal","auto":false,"nullable":false,"hasDefault":false},
    {"name":"subtotal","type":"decimal","auto":false,"nullable":false,"hasDefault":false},
    {"name":"currency","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"tax_rate","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"option_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"expiry","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
  ],
});
