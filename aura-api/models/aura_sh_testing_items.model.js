const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_testing_items",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"testing_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"program_id","type":"tinyint","auto":false,"nullable":true,"hasDefault":true},
    {"name":"o_grade","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"o_academic_year","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"o_school","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"n_grade","type":"int","auto":false,"nullable":true,"hasDefault":true},
  ],
});
