const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_taxs",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"date","type":"datetime","auto":false,"nullable":true,"hasDefault":true},
    {"name":"biller_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"type","type":"char","auto":false,"nullable":true,"hasDefault":true},
    {"name":"from_date","type":"date","auto":false,"nullable":true,"hasDefault":true},
    {"name":"to_date","type":"date","auto":false,"nullable":true,"hasDefault":true},
    {"name":"total","type":"double","auto":false,"nullable":true,"hasDefault":true},
    {"name":"vat","type":"double","auto":false,"nullable":true,"hasDefault":true},
    {"name":"grand_total","type":"double","auto":false,"nullable":true,"hasDefault":true},
    {"name":"created_by","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"created_at","type":"datetime","auto":false,"nullable":true,"hasDefault":true},
    {"name":"updated_by","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"updated_at","type":"datetime","auto":false,"nullable":true,"hasDefault":true},
  ],
});
