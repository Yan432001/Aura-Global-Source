const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_zones",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"zone_code","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"zone_name","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"parent_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"zone_group_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"city_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"district_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"commune_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
  ],
});
