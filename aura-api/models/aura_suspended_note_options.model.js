const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_suspended_note_options",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"suspended_note_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"custom_field_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"price","type":"decimal","auto":false,"nullable":false,"hasDefault":true},
  ],
});
