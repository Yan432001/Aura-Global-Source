const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_skills",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"college_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"code","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"name","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"order_by","type":"tinyint","auto":false,"nullable":true,"hasDefault":true},
    {"name":"description","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"type","type":"varchar","auto":false,"nullable":false,"hasDefault":true},
  ],
});
