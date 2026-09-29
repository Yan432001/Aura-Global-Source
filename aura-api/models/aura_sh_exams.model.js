const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_exams",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"date","type":"timestamp","auto":false,"nullable":false,"hasDefault":true},
    {"name":"start_date","type":"date","auto":false,"nullable":true,"hasDefault":true},
    {"name":"end_date","type":"date","auto":false,"nullable":true,"hasDefault":true},
    {"name":"academic_year","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"reference_no","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"title","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"biller_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"program_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"semester","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"type","type":"varchar","auto":false,"nullable":false,"hasDefault":true},
    {"name":"note","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"file","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"created_by","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"updated_by","type":"int","auto":false,"nullable":true,"hasDefault":true},
  ],
});
