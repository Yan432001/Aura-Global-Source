const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_family_groups",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"family_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"student_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
  ],
});
