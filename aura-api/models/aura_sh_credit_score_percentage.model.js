const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_sh_credit_score_percentage",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"academic_year","type":"varchar","auto":false,"nullable":false,"hasDefault":false},
    {"name":"attendance","type":"decimal","auto":false,"nullable":false,"hasDefault":true},
    {"name":"assignment","type":"decimal","auto":false,"nullable":false,"hasDefault":true},
    {"name":"midterm","type":"decimal","auto":false,"nullable":false,"hasDefault":true},
    {"name":"final","type":"decimal","auto":false,"nullable":false,"hasDefault":true},
  ],
});
