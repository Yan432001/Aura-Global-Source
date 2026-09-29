const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sessions",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"ip_address","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"timestamp","type":"int","auto":false,"nullable":false,"hasDefault":true},
    {"name":"data","type":"blob","auto":false,"nullable":false,"hasDefault":false},
  ],
});
