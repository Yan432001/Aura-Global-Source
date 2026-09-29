const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_sections",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"code","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"name","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"program_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"skill_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"grade_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"subject_id","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"description","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"score_type","type":"char","auto":false,"nullable":true,"hasDefault":true},
    {"name":"status","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
  ],
});
