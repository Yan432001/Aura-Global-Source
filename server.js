require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

async function startServer() {
  const app = express();
  const PORT = 3000;
  const auraThemeRoot = path.resolve(__dirname, 'AuraTheme');
  const distDir = path.resolve(auraThemeRoot, 'dist');
  const isDev = process.env.NODE_ENV !== 'production' && process.env.SERVE_DIST !== 'true';

  // Enable CORS and JSON body parser
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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

  // Static assets from AuraTheme public directory
  app.use(express.static(path.join(auraThemeRoot, 'public')));
  app.use('/logos', express.static(path.join(auraThemeRoot, 'public/logos')));

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

  // ---------------------------------------------------------------------------
  // Default Website UI: AuraTheme (Vite middleware in dev, dist in production)
  // ---------------------------------------------------------------------------
  let viteDevServer = null;

  if (isDev) {
    try {
      const { createServer: createViteServer } = await import('vite');
      viteDevServer = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
        root: auraThemeRoot,
        configFile: path.resolve(auraThemeRoot, 'vite.config.js')
      });
      app.use(viteDevServer.middlewares);
      console.log('[Server] Default UI: Live Vite Dev Server mounted for AuraTheme');
    } catch (viteErr) {
      console.warn('[Server] Could not initialize Vite middleware, falling back to static:', viteErr.message);
    }
  }

  // If not using Vite middleware or if production / static build mode
  if (!viteDevServer) {
    const hasDist = fs.existsSync(distDir) && fs.existsSync(path.join(distDir, 'index.html'));
    if (hasDist) {
      console.log('[Server] UI: Serving AuraTheme production build from AuraTheme/dist');
      app.use(express.static(distDir));
      app.use('/assets', express.static(path.join(distDir, 'assets')));
      app.get('*', (req, res) => {
        if (req.path.startsWith('/api')) {
          return res.status(404).json({ status: false, error: 'Endpoint not found' });
        }
        res.sendFile(path.join(distDir, 'index.html'));
      });
    } else {
      console.log('[Server] Serving AuraTheme direct root index.html');
      app.use(express.static(auraThemeRoot));
      app.get('*', (req, res) => {
        if (req.path.startsWith('/api')) {
          return res.status(404).json({ status: false, error: 'Endpoint not found' });
        }
        res.sendFile(path.join(auraThemeRoot, 'index.html'));
      });
    }
  }

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
    console.log(`🌐 Default Website:  http://0.0.0.0:${PORT}/`);
    console.log(`🛍️ E-Menu WebApp:    http://0.0.0.0:${PORT}/shop/sbc-store`);
    console.log(`📡 E-Menu & TMA API: http://0.0.0.0:${PORT}/api/tma/stores`);
    console.log(`====================================================`);
  });
}

startServer().catch((err) => {
  console.error('[Server Fatal Startup Error]', err);
  process.exit(1);
});
