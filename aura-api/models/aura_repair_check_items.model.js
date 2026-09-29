const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_repair_check_items",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"check_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"diagnostic_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"name","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"characteristic","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"symptom","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"troubleshooting","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
  ],
});
