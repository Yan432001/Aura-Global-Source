const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_tma_stores",
  primaryKey: ["id"],
  hidden: ["telegram_bot_token"],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"biller_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"store_slug","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"store_name","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"logo","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"telegram_chat_id","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"telegram_bot_token","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"is_active","type":"tinyint","auto":false,"nullable":false,"hasDefault":true},
    {"name":"created_at","type":"datetime","auto":false,"nullable":false,"hasDefault":true},
    {"name":"updated_at","type":"datetime","auto":false,"nullable":false,"hasDefault":true},
  ],
});
