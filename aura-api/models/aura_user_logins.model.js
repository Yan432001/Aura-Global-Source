const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_user_logins",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"user_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"company_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"ip_address","type":"varbinary","auto":false,"nullable":false,"hasDefault":false},
    {"name":"login","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"time","type":"timestamp","auto":false,"nullable":true,"hasDefault":true},
  ],
});
