const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_examinations",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"date","type":"datetime","auto":false,"nullable":true,"hasDefault":true},
    {"name":"academic_year","type":"char","auto":false,"nullable":true,"hasDefault":true},
    {"name":"year","type":"char","auto":false,"nullable":true,"hasDefault":true},
    {"name":"month","type":"char","auto":false,"nullable":true,"hasDefault":true},
    {"name":"program_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"skill_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"grade_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"timeshift_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"class_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"class_name","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"section_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"section_name","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"initial_file","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"final_file","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"note","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"created_by","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"updated_by","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"status","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"final","type":"tinyint","auto":false,"nullable":true,"hasDefault":true},
  ],
});
