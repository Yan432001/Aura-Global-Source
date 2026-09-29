const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_waitings",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"date","type":"datetime","auto":false,"nullable":true,"hasDefault":true},
    {"name":"biller_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"attachment","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"note","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"created_by","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"created_at","type":"datetime","auto":false,"nullable":true,"hasDefault":true},
    {"name":"updated_by","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"updated_at","type":"datetime","auto":false,"nullable":true,"hasDefault":true},
    {"name":"name","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"gender","type":"char","auto":false,"nullable":true,"hasDefault":true},
    {"name":"ethnicity","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"nationality","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"phone","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"relationship","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"status","type":"char","auto":false,"nullable":true,"hasDefault":true},
  ],
});
