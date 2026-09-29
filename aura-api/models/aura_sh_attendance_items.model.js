const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_attendance_items",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"date","type":"date","auto":false,"nullable":true,"hasDefault":true},
    {"name":"attendance_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"student_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"present","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"absent","type":"double","auto":false,"nullable":true,"hasDefault":true},
    {"name":"permission","type":"double","auto":false,"nullable":true,"hasDefault":true},
    {"name":"late","type":"double","auto":false,"nullable":true,"hasDefault":true},
    {"name":"status","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"note","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
  ],
});
