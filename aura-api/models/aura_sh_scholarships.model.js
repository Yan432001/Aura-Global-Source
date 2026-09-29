const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_scholarships",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"name","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"description","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"price_group_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"academic_year","type":"int","auto":false,"nullable":true,"hasDefault":true},
  ],
});
