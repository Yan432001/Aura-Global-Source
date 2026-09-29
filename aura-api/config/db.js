require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'aura_v1_db',
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_POOL_LIMIT || 10),
  queueLimit: 0,
  dateStrings: true,        // return DATE/DATETIME as plain strings (no timezone shifts)
  decimalNumbers: true,     // return DECIMAL as numbers instead of strings
  charset: 'utf8mb4',
});

module.exports = pool;
