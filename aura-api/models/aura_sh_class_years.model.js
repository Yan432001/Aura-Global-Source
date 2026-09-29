const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_class_years",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"academic_year","type":"char","auto":false,"nullable":true,"hasDefault":true},
    {"name":"biller_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"biller_name","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"class_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"class_name","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"room_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"room_name","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"teacher_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"teacher_name","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"program_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"program_name","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"grade_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"grade_name","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
  ],
});
