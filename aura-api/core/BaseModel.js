const pool = require('../config/db');
const { AppError } = require('../middleware/errorHandler');

const q = (id) => '`' + String(id).replace(/`/g, '``') + '`';
const STRING_TYPES = new Set(['char', 'varchar', 'text', 'tinytext', 'mediumtext', 'longtext', 'enum']);

/**
 * Generic model for one MySQL table.
 * All column / table names come from the generated schema (whitelist),
 * all values go through prepared-statement placeholders.
 */
class BaseModel {
  /**
   * @param {object} cfg
   * @param {string} cfg.table
   * @param {string[]} cfg.primaryKey   [] when the table has no primary key
   * @param {Array<{name,type,auto,nullable,hasDefault}>} cfg.columns
   * @param {string[]} [cfg.hidden]     columns never returned / never written (passwords, keys...)
   */
  constructor({ table, primaryKey = [], columns = [], hidden = [] }) {
    this.table = table;
    this.primaryKey = primaryKey;
    this.hidden = new Set(hidden);
    this.columns = columns;
    this.readable = columns.filter((c) => !this.hidden.has(c.name));
    this.writable = columns.filter((c) => !this.hidden.has(c.name) && !c.auto);
    this.colNames = new Set(this.readable.map((c) => c.name));
    this.searchable = this.readable.filter((c) => STRING_TYPES.has(c.type)).slice(0, 8);
    this.hasKey = primaryKey.length > 0;
    this.selectList = this.readable.map((c) => q(c.name)).join(', ') || '*';
  }

  // ---- helpers -----------------------------------------------------------
  _pkWhere(id) {
    const parts = String(id).split(',');
    if (parts.length !== this.primaryKey.length) {
      throw new AppError(400, `Invalid id. This table uses ${this.primaryKey.length} key column(s): ${this.primaryKey.join(',')}`);
    }
    return {
      sql: this.primaryKey.map((k) => `${q(k)} = ?`).join(' AND '),
      params: parts,
    };
  }

  _pick(body, cols) {
    const data = {};
    for (const c of cols) {
      if (body && Object.prototype.hasOwnProperty.call(body, c.name) && body[c.name] !== undefined) {
        let v = body[c.name];
        if (v !== null && typeof v === 'object') v = JSON.stringify(v);
        data[c.name] = v;
      }
    }
    return data;
  }

  // ---- queries -----------------------------------------------------------
  /**
   * List with pagination, search, exact filters and sorting.
   * query: page, limit, search, sort, order, <any column>=<value>
   */
  async findAll(query = {}) {
    const page = Math.max(parseInt(query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(query.limit, 10) || 20, 1), 200);
    const offset = (page - 1) * limit;

    const where = [];
    const params = [];

    for (const [key, val] of Object.entries(query)) {
      if (this.colNames.has(key) && val !== '' && val !== undefined && typeof val !== 'object') {
        where.push(`${q(key)} = ?`);
        params.push(val);
      }
    }

    if (query.search && this.searchable.length) {
      where.push('(' + this.searchable.map((c) => `${q(c.name)} LIKE ?`).join(' OR ') + ')');
      this.searchable.forEach(() => params.push(`%${query.search}%`));
    }

    const whereSql = where.length ? ` WHERE ${where.join(' AND ')}` : '';

    let sort = this.primaryKey[0] && this.colNames.has(this.primaryKey[0]) ? this.primaryKey[0] : null;
    if (query.sort && this.colNames.has(query.sort)) sort = query.sort;
    const order = String(query.order).toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    const orderSql = sort ? ` ORDER BY ${q(sort)} ${order}` : '';

    const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM ${q(this.table)}${whereSql}`, params);
    const [rows] = await pool.query(
      `SELECT ${this.selectList} FROM ${q(this.table)}${whereSql}${orderSql} LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return { rows, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id) {
    const w = this._pkWhere(id);
    const [rows] = await pool.query(`SELECT ${this.selectList} FROM ${q(this.table)} WHERE ${w.sql} LIMIT 1`, w.params);
    return rows[0] || null;
  }

  async create(body) {
    const data = this._pick(body, this.writable);
    const keys = Object.keys(data);
    if (!keys.length) throw new AppError(400, 'No valid fields in request body');

    const [result] = await pool.query(
      `INSERT INTO ${q(this.table)} (${keys.map(q).join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`,
      keys.map((k) => data[k])
    );

    if (this.primaryKey.length === 1 && result.insertId) return this.findById(result.insertId);
    if (this.primaryKey.length && this.primaryKey.every((k) => data[k] !== undefined)) {
      return this.findById(this.primaryKey.map((k) => data[k]).join(','));
    }
    return data;
  }

  async update(id, body) {
    const w = this._pkWhere(id);
    const cols = this.writable.filter((c) => !this.primaryKey.includes(c.name));
    const data = this._pick(body, cols);
    const keys = Object.keys(data);
    if (!keys.length) throw new AppError(400, 'No valid fields in request body');

    const [result] = await pool.query(
      `UPDATE ${q(this.table)} SET ${keys.map((k) => `${q(k)} = ?`).join(', ')} WHERE ${w.sql}`,
      [...keys.map((k) => data[k]), ...w.params]
    );
    if (!result.affectedRows) return null;
    return this.findById(id);
  }

  async remove(id) {
    const w = this._pkWhere(id);
    const [result] = await pool.query(`DELETE FROM ${q(this.table)} WHERE ${w.sql}`, w.params);
    return result.affectedRows > 0;
  }
}

module.exports = BaseModel;
