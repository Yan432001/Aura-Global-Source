const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sales_rank_commission",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"name","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"start_rank","type":"decimal","auto":false,"nullable":false,"hasDefault":false},
    {"name":"end_rank","type":"decimal","auto":false,"nullable":false,"hasDefault":false},
    {"name":"commission","type":"decimal","auto":false,"nullable":false,"hasDefault":false},
  ],
});
