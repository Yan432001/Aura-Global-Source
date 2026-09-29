const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_stock_type",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"name","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"description","type":"text","auto":false,"nullable":false,"hasDefault":false},
  ],
});
