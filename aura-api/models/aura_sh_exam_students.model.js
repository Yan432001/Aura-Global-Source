const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_exam_students",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"exam_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"student_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"study_info_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"status","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"exam_status","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"description","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"exam_schedule_id","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
  ],
});
