const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_grade_point_average",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"min_score","type":"decimal","auto":false,"nullable":false,"hasDefault":false},
    {"name":"max_score","type":"decimal","auto":false,"nullable":false,"hasDefault":false},
    {"name":"grade","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"point","type":"decimal","auto":false,"nullable":false,"hasDefault":false},
    {"name":"description","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
  ],
});
