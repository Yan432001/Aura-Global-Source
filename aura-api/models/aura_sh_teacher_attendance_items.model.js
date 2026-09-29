const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_teacher_attendance_items",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"attendance_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"teacher_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"present","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"absent","type":"double","auto":false,"nullable":true,"hasDefault":true},
    {"name":"permission_before","type":"double","auto":false,"nullable":true,"hasDefault":true},
    {"name":"permission_after","type":"double","auto":false,"nullable":true,"hasDefault":true},
    {"name":"not_scan","type":"double","auto":false,"nullable":true,"hasDefault":true},
    {"name":"late","type":"double","auto":false,"nullable":true,"hasDefault":true},
    {"name":"note","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"emergency","type":"double","auto":false,"nullable":true,"hasDefault":true},
    {"name":"table_time_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
  ],
});
