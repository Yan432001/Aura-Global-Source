const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_grade_students",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"grade_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"academic_year","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"program_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"number_student","type":"int","auto":false,"nullable":true,"hasDefault":true},
  ],
});
