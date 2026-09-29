const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_teacher_qualifications",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"teacher_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"certificate","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"major","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"school","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"degree","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"start_date","type":"date","auto":false,"nullable":true,"hasDefault":true},
    {"name":"end_date","type":"date","auto":false,"nullable":true,"hasDefault":true},
    {"name":"language","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"attachment","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"description","type":"text","auto":false,"nullable":true,"hasDefault":false},
  ],
});
