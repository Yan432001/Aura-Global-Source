const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_suspended_assign",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"date","type":"datetime","auto":false,"nullable":true,"hasDefault":true},
    {"name":"sale_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"assign_date","type":"datetime","auto":false,"nullable":true,"hasDefault":true},
    {"name":"patient_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"bed","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"description","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"price","type":"float","auto":false,"nullable":true,"hasDefault":true},
    {"name":"amount","type":"float","auto":false,"nullable":true,"hasDefault":true},
    {"name":"status","type":"tinyint","auto":false,"nullable":false,"hasDefault":true},
  ],
});
