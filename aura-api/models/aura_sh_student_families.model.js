const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_student_families",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"family_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"relationship","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"phone","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"email","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"facebook","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"city_id","type":"tinyint","auto":false,"nullable":true,"hasDefault":true},
    {"name":"district_id","type":"tinyint","auto":false,"nullable":true,"hasDefault":true},
    {"name":"commune_id","type":"tinyint","auto":false,"nullable":true,"hasDefault":true},
    {"name":"address","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"school_app","type":"char","auto":false,"nullable":true,"hasDefault":true},
    {"name":"full_name","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"ethnicity","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"nationality","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"highest_education","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"occupation","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"type","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
  ],
});
