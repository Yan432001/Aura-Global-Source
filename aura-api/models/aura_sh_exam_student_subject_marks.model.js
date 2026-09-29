const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_exam_student_subject_marks",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"exam_schedule_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"exam_student_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"attendance","type":"decimal","auto":false,"nullable":false,"hasDefault":true},
    {"name":"assignment","type":"decimal","auto":false,"nullable":false,"hasDefault":true},
    {"name":"midterm","type":"decimal","auto":false,"nullable":false,"hasDefault":true},
    {"name":"final","type":"decimal","auto":false,"nullable":false,"hasDefault":true},
    {"name":"description","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"row_id","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
  ],
});
