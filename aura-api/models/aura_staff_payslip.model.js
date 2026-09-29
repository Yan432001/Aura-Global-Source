const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_staff_payslip",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"staff_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"biller_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"basic","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"total_allowance","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"total_deduction","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"leave_deduction","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"tax","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"overtime","type":"decimal","auto":false,"nullable":true,"hasDefault":true},
    {"name":"loan","type":"decimal","auto":false,"nullable":true,"hasDefault":true},
    {"name":"commission","type":"decimal","auto":false,"nullable":true,"hasDefault":true},
    {"name":"net_salary","type":"float","auto":false,"nullable":false,"hasDefault":false},
    {"name":"status","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"month","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"year","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"payment_mode","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"payment_date","type":"timestamp","auto":false,"nullable":false,"hasDefault":true},
    {"name":"remark","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
  ],
});
