const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_tank_nozzles",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"tank_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"saleman_id","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"product_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"nozzle_no","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"nozzle_start_no","type":"double","auto":false,"nullable":true,"hasDefault":true},
    {"name":"warehouse_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
  ],
});
