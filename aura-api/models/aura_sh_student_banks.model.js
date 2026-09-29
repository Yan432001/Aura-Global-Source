const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_student_banks",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"family_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"belong_to","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"bank_name","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"account_name","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"account_number","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
  ],
});
