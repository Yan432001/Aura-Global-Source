const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_rewards",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"category","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"type","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"exchange_product_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"exchange_quantity","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"receive_product_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"receive_quantity","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"amount","type":"decimal","auto":false,"nullable":false,"hasDefault":true},
    {"name":"interest","type":"decimal","auto":false,"nullable":true,"hasDefault":true},
  ],
});
