const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_examination_items",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"examination_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"student_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"subject_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"score","type":"decimal","auto":false,"nullable":true,"hasDefault":true},
    {"name":"score_by_subject","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
  ],
});
