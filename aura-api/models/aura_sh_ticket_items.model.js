const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_ticket_items",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"ticket_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"group_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"feedback","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"comment","type":"text","auto":false,"nullable":true,"hasDefault":false},
  ],
});
