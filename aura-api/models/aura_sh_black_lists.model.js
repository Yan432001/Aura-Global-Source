const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_black_lists",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"father","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"mother","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"guardian","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"description","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"student_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"status","type":"char","auto":false,"nullable":true,"hasDefault":true},
    {"name":"student_name","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"student_name_latin","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
  ],
});
