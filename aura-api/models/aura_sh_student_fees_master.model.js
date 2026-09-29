const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_student_fees_master",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"student_session_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"fee_session_group_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"amount","type":"float","auto":false,"nullable":true,"hasDefault":true},
    {"name":"discount","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"amount_discount","type":"decimal","auto":false,"nullable":false,"hasDefault":false},
    {"name":"is_active","type":"varchar","auto":false,"nullable":false,"hasDefault":true},
    {"name":"created_at","type":"timestamp","auto":false,"nullable":false,"hasDefault":true},
    {"name":"payment_status","type":"char","auto":false,"nullable":true,"hasDefault":true},
    {"name":"invoice_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
  ],
});
