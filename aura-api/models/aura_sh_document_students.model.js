const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_document_students",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"document_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"student_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"attachment","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"created_by","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"created_at","type":"datetime","auto":false,"nullable":true,"hasDefault":true},
    {"name":"description","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
  ],
});
