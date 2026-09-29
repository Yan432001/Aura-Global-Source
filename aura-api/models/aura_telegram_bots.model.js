const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_telegram_bots",
  primaryKey: ["id"],
  hidden: ["token_id"],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"name","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"token_id","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"chat_id","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"transaction","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"biller","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"warehouse","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"status","type":"char","auto":false,"nullable":true,"hasDefault":true},
  ],
});
