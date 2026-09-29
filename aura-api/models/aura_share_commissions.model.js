const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_share_commissions",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"salesman_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"share_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
  ],
});
