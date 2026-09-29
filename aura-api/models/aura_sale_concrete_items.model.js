const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sale_concrete_items",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"sale_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"con_sale_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"date","type":"date","auto":false,"nullable":true,"hasDefault":true},
    {"name":"reference","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"total","type":"double","auto":false,"nullable":true,"hasDefault":true},
    {"name":"truck_charge","type":"double","auto":false,"nullable":true,"hasDefault":true},
    {"name":"pump_charge","type":"double","auto":false,"nullable":true,"hasDefault":true},
    {"name":"subtotal","type":"double","auto":false,"nullable":true,"hasDefault":true},
  ],
});
