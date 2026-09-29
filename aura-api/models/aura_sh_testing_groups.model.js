const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_testing_groups",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"name","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"academic_year","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"testing_date","type":"date","auto":false,"nullable":true,"hasDefault":true},
    {"name":"close_enrollment_date","type":"date","auto":false,"nullable":true,"hasDefault":true},
    {"name":"description","type":"text","auto":false,"nullable":true,"hasDefault":false},
  ],
});
