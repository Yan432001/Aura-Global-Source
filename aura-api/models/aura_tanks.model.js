const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_tanks",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"code","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"name","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"warehouse_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"inactive","type":"tinyint","auto":false,"nullable":true,"hasDefault":true},
  ],
});
