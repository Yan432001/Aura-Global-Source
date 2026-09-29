const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_teach_infos",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"teacher_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"subject_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"subject","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"grade_id","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"grade","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"description","type":"text","auto":false,"nullable":true,"hasDefault":false},
  ],
});
