const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_student_faults",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"student_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"date","type":"date","auto":false,"nullable":true,"hasDefault":true},
    {"name":"class_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"academic_year","type":"char","auto":false,"nullable":true,"hasDefault":true},
    {"name":"description","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"attachment","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"blacklist","type":"tinyint","auto":false,"nullable":true,"hasDefault":true},
    {"name":"created_date","type":"datetime","auto":false,"nullable":true,"hasDefault":true},
    {"name":"created_by","type":"int","auto":false,"nullable":true,"hasDefault":true},
  ],
});
