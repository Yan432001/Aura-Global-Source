require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Enable CORS and JSON body parser
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets
app.use(express.static(path.join(__dirname, 'public')));

// Root health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: true,
    service: 'Aura Global Hospitality & E-Menu Platform',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Mount Core Application Routes
try {
  const tmaRoute = require('./API/app/config/route/tma.route');
  app.use('/api/tma', tmaRoute);
  console.log('[Route] Mounted /api/tma');
} catch (err) {
  console.warn('[Route] Warning mounting /api/tma:', err.message);
}

try {
  const emenuRoute = require('./API/app/config/route/emenu.route');
  app.use('/api/emenu', emenuRoute);
  console.log('[Route] Mounted /api/emenu');
} catch (err) {
  console.warn('[Route] Warning mounting /api/emenu:', err.message);
}

try {
  require('./API/app/config/route/cms.route')(app);
  console.log('[Route] Mounted /api/cms');
} catch (err) {
  console.warn('[Route] Warning mounting /api/cms:', err.message);
}

// Mount Admin & ERP Module Routes
const adminRoutes = [
  'auth',
  'products',
  'categories',
  'setting',
  'address',
  'borrower',
  'permissions',
  'product.options',
  'product.photo',
  'product.price',
  'product.rack',
  'product.serials',
  'product.units',
  'product.variants'
];

for (const routeName of adminRoutes) {
  try {
    const routeFn = require(`./API/app/config/route/admin/${routeName}.route`);
    if (typeof routeFn === 'function') {
      routeFn(app);
      console.log(`[Route] Mounted admin/${routeName}.route`);
    }
  } catch (err) {
    console.warn(`[Route] Notice mounting admin/${routeName}.route:`, err.message);
  }
}

// Telegram Bot Polling (Non-blocking & conflict resilient)
try {
  const bot = require('./API/app/services/telegramBot.service');
  if (bot && process.env.TELEGRAM_BOT_TOKEN) {
    bot.start({
      onStart: (botInfo) => {
        console.log(`[Telegram Bot] Started polling as @${botInfo.username}`);
      }
    }).catch((err) => {
      console.log('[Telegram Bot] Notice: Bot polling conflict or disabled:', err.message);
    });
  }
} catch (err) {
  console.log('[Telegram Bot] Running in local simulation mode:', err.message);
}

// Fallback for SPA routing (/shop/:slug, /tma/:slug, etc.)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ status: false, error: 'Endpoint not found' });
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(500).json({
    status: false,
    error: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🚀 Aura Global Server running at http://0.0.0.0:${PORT}`);
  console.log(`📡 E-Menu & TMA API: http://0.0.0.0:${PORT}/api/tma/stores`);
  console.log(`📰 CMS Content API:  http://0.0.0.0:${PORT}/api/cms/all`);
  console.log(`====================================================`);
});
