const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_warehouses",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"code","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"name","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"address","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"map","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"phone","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"email","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"atten_name","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"fax","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"price_group_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"logo","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"default_currency","type":"int","auto":false,"nullable":false,"hasDefault":true},
    {"name":"overselling","type":"tinyint","auto":false,"nullable":true,"hasDefault":true},
    {"name":"saleable","type":"tinyint","auto":false,"nullable":false,"hasDefault":true},
  ],
});
