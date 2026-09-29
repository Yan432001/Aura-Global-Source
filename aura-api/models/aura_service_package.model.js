const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_service_package",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"package_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"service_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"qty","type":"decimal","auto":false,"nullable":false,"hasDefault":false},
    {"name":"description","type":"text","auto":false,"nullable":false,"hasDefault":false},
  ],
});
