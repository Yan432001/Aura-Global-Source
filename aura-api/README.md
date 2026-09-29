# Aura API (Node.js + Express + MySQL)

466 tables from `aura_v1_db` -> one **model**, **controller**, **route** each (generated), all mounted in `routes/index.js` and started by `index.js`.

## Run
```bash
npm install
cp .env.example .env      # set DB_USER / DB_PASSWORD / DB_NAME
npm start                 # http://localhost:3000
```
Import the SQL into MySQL first (`aura_v1_db`).

- `GET /`        server info + list of all 466 endpoints
- `GET /health`  database ping
- Every `/api/*` request needs header `api-key: <value of aura_api_keys.key>`
  (set `API_KEY_AUTH=false` in `.env` for local testing only).

## Endpoints (same for every table; prefix `aura_` removed, `_` -> `-`)
| Method | URL | Action |
|---|---|---|
| GET | `/api/products?page=1&limit=20&search=abc&sort=id&order=desc&category_id=3` | list |
| GET | `/api/products/:id` | show |
| POST | `/api/products` | create |
| PUT/PATCH | `/api/products/:id` | update |
| DELETE | `/api/products/:id` | delete |

Example: table `aura_account_journals` -> `/api/account-journals`.

Notes
- Composite key (`aura_account_settings`): `/api/account-settings/1,3` (id,biller_id).
- 29 tables have no primary key -> list + create only.
- Password / token / key columns (e.g. `aura_users.password`) are never returned or written.
- Add custom logic in `controllers/<table>.controller.js`.
- After a schema change: `node scripts/generate.js path/to/new.sql` (overwrites models/controllers/routes).

## Structure
```
index.js              entry point
config/db.js          MySQL pool
core/                 BaseModel, createController, createRouter
middleware/           apiKey, errorHandler
models|controllers|routes/   one file per table (generated)
scripts/generate.js   generator
```
