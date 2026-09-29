const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sms_settings",
  primaryKey: [],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"auto_send","type":"tinyint","auto":false,"nullable":true,"hasDefault":true},
    {"name":"config","type":"text","auto":false,"nullable":true,"hasDefault":false},
  ],
});
