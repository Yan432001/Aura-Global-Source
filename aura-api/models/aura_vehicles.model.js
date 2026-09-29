const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_vehicles",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"code","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"model","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"note","type":"text","auto":false,"nullable":true,"hasDefault":false},
    {"name":"attachment","type":"varchar","auto":false,"nullable":true,"hasDefault":true},
    {"name":"driver_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"status","type":"char","auto":false,"nullable":true,"hasDefault":true},
    {"name":"fuel_id","type":"int","auto":false,"nullable":true,"hasDefault":true},
  ],
});
