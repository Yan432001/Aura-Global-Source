const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_score_yearly",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"exam_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"academic_year","type":"char","auto":false,"nullable":true,"hasDefault":true},
    {"name":"biller_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"biller_name","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"student_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"program_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"program_name","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"grade_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"grade_name","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"class_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"class_name","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"rank","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"average","type":"double","auto":false,"nullable":true,"hasDefault":true},
    {"name":"subject_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"subject_name","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
  ],
});
