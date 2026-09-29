const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_grade_fees",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"biller_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"academic_year","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"program_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"skill_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"grade_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"section_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"fee_type","type":"char","auto":false,"nullable":true,"hasDefault":true},
    {"name":"feestype_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"product_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"name","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"price","type":"float","auto":false,"nullable":true,"hasDefault":true},
    {"name":"child_no","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"student_type","type":"char","auto":false,"nullable":true,"hasDefault":true},
  ],
});
