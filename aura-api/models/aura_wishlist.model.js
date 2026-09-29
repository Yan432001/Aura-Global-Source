const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_wishlist",
  primaryKey: [],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"user_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"product_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
  ],
});
