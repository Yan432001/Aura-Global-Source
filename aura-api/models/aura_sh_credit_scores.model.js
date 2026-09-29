const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_credit_scores",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"credit","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"program_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"grade_id","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"grade_name","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"subject_id","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"subject_name","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"full_score","type":"double","auto":false,"nullable":true,"hasDefault":true},
    {"name":"min_score","type":"double","auto":false,"nullable":true,"hasDefault":true},
    {"name":"max_score","type":"double","auto":false,"nullable":true,"hasDefault":true},
    {"name":"color","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"description","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"cal_score","type":"double","auto":false,"nullable":true,"hasDefault":true},
  ],
});
