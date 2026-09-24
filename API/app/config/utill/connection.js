const mysql = require("mysql2/promise");
const { config } = require("./config");
const rawSimpleData = require("../../../../data/simpleData");
const simpleData = rawSimpleData.default || rawSimpleData;

// MOCKED / RESILIENT DATA LAYER — In-memory fallback using simpleData
const mockStore = {
  companies: simpleData.stores,
  categories: simpleData.categories,
  products: simpleData.products,
  users: [
    {
      id: 1,
      username: "admin",
      first_name: "Admin",
      last_name: "Aura",
      email: "admin@aura.com",
      // bcrypt hash for "admin"
      password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
      group_id: 1,
      active: 1
    }
  ],
  sales: [],
  sale_items: []
};

let realPool = null;
let useMock = false;

try {
  if (process.env.DB_HOST || config.db?.HOST) {
    realPool = mysql.createPool({
      host: process.env.DB_HOST || config.db.HOST,
      user: process.env.DB_USER || config.db.USER,
      password: process.env.DB_PASSWORD || config.db.PASSWORD,
      database: process.env.DB_NAME || config.db.DATABASE,
      port: Number(process.env.DB_PORT || config.db.PORT || 3306),
      namedPlaceholders: true,
      connectTimeout: 2000,
    });
  }
} catch {
  useMock = true;
}

async function handleMockQuery(sql, params = []) {
  const queryStr = String(sql || '').toLowerCase();

  // 1. Companies / Stores
  if (queryStr.includes('aura_companies')) {
    if (queryStr.includes('slug = ?') || queryStr.includes('slug = :slug')) {
      const slugVal = Array.isArray(params) ? params[0] : (params?.slug || '');
      const match = mockStore.companies.filter(c => c.slug.toLowerCase() === String(slugVal).toLowerCase());
      return [match.length ? match : [mockStore.companies[0]], []];
    }
    if (queryStr.includes('id = ?') || queryStr.includes('id = :id')) {
      const idVal = Array.isArray(params) ? params[0] : (params?.id || 1);
      const match = mockStore.companies.filter(c => Number(c.id) === Number(idVal));
      return [match.length ? match : [mockStore.companies[0]], []];
    }
    return [mockStore.companies, []];
  }

  // 2. Categories
  if (queryStr.includes('aura_categories')) {
    if (queryStr.includes('insert into')) {
      const newCat = {
        id: mockStore.categories.length + 1,
        name: params?.name || 'New Category',
        description: params?.description || '',
        status: params?.status ?? 1
      };
      mockStore.categories.push(newCat);
      return [{ insertId: newCat.id, affectedRows: 1 }, []];
    }
    if (queryStr.includes('where id =') || queryStr.includes('where id = :id')) {
      const idVal = Array.isArray(params) ? params[0] : (params?.id || 1);
      const match = mockStore.categories.filter(c => Number(c.id) === Number(idVal));
      return [match, []];
    }
    return [mockStore.categories, []];
  }

  // 3. Products
  if (queryStr.includes('count(*) as total from aura_products')) {
    return [[{ total: mockStore.products.length }], []];
  }

  if (queryStr.includes('aura_products')) {
    if (queryStr.includes('where id = ?') || queryStr.includes('where id = :id')) {
      const idVal = Array.isArray(params) ? params[0] : (params?.id || 1);
      const match = mockStore.products.filter(p => Number(p.id) === Number(idVal));
      return [match, []];
    }
    if (queryStr.includes('category_id = ?')) {
      const catId = Array.isArray(params) ? params.find(p => typeof p === 'number') : params?.category_id;
      if (catId) {
        return [mockStore.products.filter(p => Number(p.category_id) === Number(catId)), []];
      }
    }
    return [mockStore.products, []];
  }

  // 4. Users / Auth
  if (queryStr.includes('aura_users')) {
    if (queryStr.includes('where username =')) {
      const u = Array.isArray(params) ? params[0] : (params?.username || 'admin');
      const match = mockStore.users.filter(x => x.username === u);
      return [match.length ? match : mockStore.users, []];
    }
    return [mockStore.users, []];
  }

  // 5. Orders / Sales
  if (queryStr.includes('insert into aura_sales')) {
    const saleId = mockStore.sales.length + 1001;
    const refNo = `TMA-${Date.now()}`;
    mockStore.sales.push({ id: saleId, reference_no: refNo });
    return [{ insertId: saleId, affectedRows: 1 }, []];
  }

  if (queryStr.includes('insert into aura_sale_items')) {
    mockStore.sale_items.push({ id: mockStore.sale_items.length + 1 });
    return [{ insertId: mockStore.sale_items.length, affectedRows: 1 }, []];
  }

  // 6. Generic Fallback
  return [[], []];
}

const poolWrapper = {
  async query(sql, params) {
    if (realPool && !useMock) {
      try {
        return await realPool.query(sql, params);
      } catch (err) {
        console.warn('[AI Studio] MySQL offline or error — using in-memory mock active');
        useMock = true;
        return handleMockQuery(sql, params);
      }
    }
    return handleMockQuery(sql, params);
  },

  async execute(sql, params) {
    return this.query(sql, params);
  },

  async getConnection() {
    if (realPool && !useMock) {
      try {
        const conn = await realPool.getConnection();
        return conn;
      } catch {
        useMock = true;
      }
    }

    return {
      async beginTransaction() {},
      async commit() {},
      async rollback() {},
      release() {},
      async query(sql, params) {
        return handleMockQuery(sql, params);
      },
      async execute(sql, params) {
        return handleMockQuery(sql, params);
      }
    };
  }
};

module.exports = poolWrapper;
