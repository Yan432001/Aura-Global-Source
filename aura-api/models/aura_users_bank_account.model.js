const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_users_bank_account",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"user_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"bankaccount_code","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
  ],
});
