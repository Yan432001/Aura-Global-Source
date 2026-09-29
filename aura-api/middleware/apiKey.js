const pool = require('../config/db');
const { AppError } = require('./errorHandler');

// Validates header "api-key" (or "x-api-key") against table aura_api_keys.`key`
const cache = new Map(); // key -> expiry timestamp
const TTL = 60 * 1000;

module.exports = async function apiKey(req, res, next) {
  try {
    if (String(process.env.API_KEY_AUTH).toLowerCase() === 'false') return next();

    const key = req.get('api-key') || req.get('x-api-key');
    if (!key) throw new AppError(403, 'API key is required (header: api-key)');

    const hit = cache.get(key);
    if (hit && hit > Date.now()) return next();

    const [rows] = await pool.query('SELECT `id`, `user_id`, `level` FROM `aura_api_keys` WHERE `key` = ? LIMIT 1', [key]);
    if (!rows.length) throw new AppError(403, 'Invalid API key');

    cache.set(key, Date.now() + TTL);
    req.apiKey = rows[0];
    next();
  } catch (err) {
    next(err);
  }
};
