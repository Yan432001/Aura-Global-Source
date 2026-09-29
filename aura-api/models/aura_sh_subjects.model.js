const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_subjects",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"skill_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"code","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"name","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"description","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"status","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"type","type":"varchar","auto":false,"nullable":false,"hasDefault":true},
  ],
});
