const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_user_audit_trails",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"user_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"event","type":"enum","auto":false,"nullable":false,"hasDefault":false},
    {"name":"table_name","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"old_values","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"new_values","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"url","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"name","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"ip_address","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"user_agent","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"created_at","type":"timestamp","auto":false,"nullable":true,"hasDefault":true},
  ],
});
