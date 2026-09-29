const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_follow_ups",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"waiting_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"date","type":"datetime","auto":false,"nullable":true,"hasDefault":true},
    {"name":"phone","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"customer_comment","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"note","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"created_by","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"created_at","type":"datetime","auto":false,"nullable":true,"hasDefault":true},
    {"name":"updated_by","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"updated_at","type":"datetime","auto":false,"nullable":true,"hasDefault":true},
    {"name":"attachment","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
  ],
});
