const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_assign_class_teacher",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"biller_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"class_id","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"section_id","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"teacher_id","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
  ],
});
