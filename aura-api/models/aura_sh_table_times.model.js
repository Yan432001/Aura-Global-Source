const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_table_times",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"class_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"academic_year","type":"char","auto":false,"nullable":true,"hasDefault":true},
    {"name":"section_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"subject_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"teacher_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"room_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"day","type":"date","auto":false,"nullable":true,"hasDefault":true},
    {"name":"day_name","type":"char","auto":false,"nullable":true,"hasDefault":true},
    {"name":"start_time","type":"time","auto":false,"nullable":true,"hasDefault":true},
    {"name":"end_time","type":"time","auto":false,"nullable":true,"hasDefault":true},
  ],
});
