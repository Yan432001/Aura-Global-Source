const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_waiting_items",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"waiting_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"student","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"student_latin","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"gender","type":"char","auto":false,"nullable":true,"hasDefault":true},
    {"name":"old_school","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"old_academic_year","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"old_grade_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"acedemic_year","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"grade_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
  ],
});
