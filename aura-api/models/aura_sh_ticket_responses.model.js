const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_ticket_responses",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"ticket_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"date","type":"datetime","auto":false,"nullable":true,"hasDefault":true},
    {"name":"comment","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"created_by","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"status","type":"char","auto":false,"nullable":true,"hasDefault":true},
  ],
});
