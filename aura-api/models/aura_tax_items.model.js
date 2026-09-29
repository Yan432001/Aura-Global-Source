const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_tax_items",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"tax_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"transaction","type":"char","auto":false,"nullable":true,"hasDefault":true},
    {"name":"transaction_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"reference_no","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"tax_reference","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"date","type":"datetime","auto":false,"nullable":true,"hasDefault":true},
    {"name":"name","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"company","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"vat_no","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"phone","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"total","type":"double","auto":false,"nullable":true,"hasDefault":true},
    {"name":"order_tax","type":"double","auto":false,"nullable":true,"hasDefault":true},
    {"name":"grand_total","type":"double","auto":false,"nullable":true,"hasDefault":true},
    {"name":"exchange_rate","type":"double","auto":false,"nullable":true,"hasDefault":true},
    {"name":"note","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"quantity","type":"double","auto":false,"nullable":true,"hasDefault":true},
  ],
});
