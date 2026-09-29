const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_exam_schedules",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"exam_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"day","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"room_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"start_time","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"end_time","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"batch","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"skill_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"subject_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"description","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"row_id","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
  ],
});
