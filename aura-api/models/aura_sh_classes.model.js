const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_classes",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"biller_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"code","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"name","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"section_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"program_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"skill_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"grade_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"timeshift_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"teacher_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"description","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"status","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"type","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
  ],
});
