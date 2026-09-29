const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_used_fuels",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"biller_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"date","type":"datetime","auto":false,"nullable":true,"hasDefault":true},
    {"name":"delivery_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"moving_waiting_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"mission_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"fuel_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"driver_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"truck_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"kilometer","type":"double","auto":false,"nullable":true,"hasDefault":true},
    {"name":"in_range_litre","type":"double","auto":false,"nullable":true,"hasDefault":true},
    {"name":"out_range_litre","type":"double","auto":false,"nullable":true,"hasDefault":true},
    {"name":"pump_litre","type":"double","auto":false,"nullable":true,"hasDefault":true},
    {"name":"waiting_litre","type":"double","auto":false,"nullable":true,"hasDefault":true},
    {"name":"moving_litre","type":"double","auto":false,"nullable":true,"hasDefault":true},
    {"name":"mission_litre","type":"double","auto":false,"nullable":true,"hasDefault":true},
    {"name":"fuel_litre","type":"double","auto":false,"nullable":true,"hasDefault":true},
    {"name":"fuel_expense_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
  ],
});
