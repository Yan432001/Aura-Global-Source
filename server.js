require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');

async function start() {
  const apiApp = require('./API/index.js');
  const port = 3000;
  const host = '0.0.0.0';

  const distDir = path.resolve(__dirname, 'AuraTheme/dist');
  const isProd = process.env.NODE_ENV === 'production';

  if (isProd && fs.existsSync(distDir)) {
    console.log('[Server] Serving production dist bundle from AuraTheme/dist');
    apiApp.use(express.static(distDir));
    apiApp.use((req, res, next) => {
      if (req.method === 'GET' && !req.path.startsWith('/api')) {
        return res.sendFile(path.resolve(distDir, 'index.html'));
      }
      next();
    });
  } else {
    console.log('[Server] Starting Vite in middleware mode on port ' + port);
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      root: path.resolve(__dirname, 'AuraTheme'),
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });

    apiApp.use(vite.middlewares);

    // Serve transformed index.html for client-side routing fallback in Express 5
    apiApp.use(async (req, res, next) => {
      const url = req.originalUrl || req.url;
      if (url.startsWith('/api') || req.method !== 'GET') return next();

      try {
        const indexPath = path.resolve(__dirname, 'AuraTheme/index.html');
        let template = fs.readFileSync(indexPath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (err) {
        vite.ssrFixStacktrace(err);
        next(err);
      }
    });
  }

  apiApp.listen(port, host, () => {
    console.log(`[Server] Aura Global running at http://${host}:${port}`);
  });
}

start().catch((err) => {
  console.error('[Server] Fatal startup error:', err);
  process.exit(1);
});
