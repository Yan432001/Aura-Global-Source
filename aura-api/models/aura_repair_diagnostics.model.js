const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_repair_diagnostics",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"code","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"name","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"characteristic","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"brand","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"model","type":"int","auto":false,"nullable":true,"hasDefault":true},
  ],
});
