const BaseModel = require('../core/BaseModel');

module.exports = new BaseModel({
  table: "aura_reservation",
  primaryKey: ["id"],
  hidden: [],
  columns: [
    {"name":"id","type":"int","auto":true,"nullable":false,"hasDefault":false},
    {"name":"note_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"sale_id","type":"int","auto":false,"nullable":false,"hasDefault":false},
    {"name":"checkIn","type":"datetime","auto":false,"nullable":true,"hasDefault":true},
    {"name":"checkIn_by","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"checkOut","type":"datetime","auto":false,"nullable":true,"hasDefault":true},
    {"name":"checkOut_by","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"duration","type":"int","auto":false,"nullable":false,"hasDefault":true},
    {"name":"from","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"destination","type":"int","auto":false,"nullable":true,"hasDefault":true},
    {"name":"timeout","type":"int","auto":false,"nullable":true,"hasDefault":true},
  ],
});
