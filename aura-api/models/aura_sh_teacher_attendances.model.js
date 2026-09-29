const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_teacher_attendances",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"date","type":"datetime","auto":false,"nullable":true,"hasDefault":true},
    {"name":"academic_year","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"biller_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"biller_name","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"year","type":"char","auto":false,"nullable":true,"hasDefault":true},
    {"name":"month","type":"char","auto":false,"nullable":true,"hasDefault":true},
    {"name":"day","type":"date","auto":false,"nullable":true,"hasDefault":true},
    {"name":"teacher_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"initial_file","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"final_file","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"note","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"created_by","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"updated_by","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"status","type":"char","auto":false,"nullable":true,"hasDefault":true},
  ],
});
