const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_grades",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"code","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"name","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"description","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"status","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"graduate","type":"tinyint","auto":false,"nullable":true,"hasDefault":true},
  ],
});
