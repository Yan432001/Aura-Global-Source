const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_teacher_working_histories",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"teacher_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"company","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"position","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"start_date","type":"date","auto":false,"nullable":true,"hasDefault":true},
    {"name":"end_date","type":"date","auto":false,"nullable":true,"hasDefault":true},
    {"name":"description","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"attachment","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
  ],
});
