const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_tank_nozzle_salesmans",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"tank_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"nozzle_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"saleman_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
  ],
});
