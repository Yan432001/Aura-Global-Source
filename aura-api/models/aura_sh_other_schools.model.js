const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_other_schools",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"name","type":"text","auto":false,"nullable":true,"hasDefault":false},
  ],
});
