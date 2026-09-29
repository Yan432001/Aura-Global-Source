require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const pool = require('./config/db');
const apiKey = require('./middleware/apiKey');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const apiRoutes = require('./routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api', rateLimit({ windowMs: 60 * 1000, max: 300 }));

// Home: shows that the server runs + list of all endpoints
app.get('/', (req, res) => {
  res.json({
    success: true,
    name: 'Aura API',
    database: process.env.DB_NAME || 'aura_v1_db',
    totalResources: apiRoutes.resources.length,
    auth: String(process.env.API_KEY_AUTH).toLowerCase() === 'false' ? 'off' : 'header "api-key" required on /api/*',
    usage: {
      list: 'GET    /api/:resource?page=1&limit=20&search=abc&sort=id&order=desc&<column>=<value>',
      show: 'GET    /api/:resource/:id   (composite key: /api/:resource/1,3)',
      create: 'POST   /api/:resource',
      update: 'PUT    /api/:resource/:id',
      delete: 'DELETE /api/:resource/:id',
    },
    resources: apiRoutes.resources,
  });
});

// Health check (DB ping)
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ success: true, db: 'connected' });
  } catch (e) {
    res.status(503).json({ success: false, db: 'disconnected', message: e.code || e.message });
  }
});

app.use('/api', apiKey, apiRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT || 3000);
if (require.main === module) {
  app.listen(PORT, () => console.log(`Aura API running on http://localhost:${PORT}  (${apiRoutes.resources.length} resources)`));
}

module.exports = app;
