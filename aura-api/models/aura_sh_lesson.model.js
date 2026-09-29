const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_lesson",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"name","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"image","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"description","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"course_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"url","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"lesson_type","type":"int","auto":false,"nullable":true,"hasDefault":true},
  ],
});
