const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_tax_rates",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"name","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"code","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"rate","type":"decimal","auto":false,"nullable":false,"hasDefault":false},
    {"name":"type","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
  ],
});
