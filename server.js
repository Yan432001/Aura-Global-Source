import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Mount the API application from /API
try {
  const apiApp = require('./API/index.js');
  app.use(apiApp);
  console.log('[Aura Global] API routes mounted successfully');
} catch (err) {
  console.error('[Aura Global] Error loading API module:', err);
}

// Check if production build exists
const distPath = path.resolve(__dirname, 'AuraTheme/dist');
const isProduction = process.env.NODE_ENV === 'production' && fs.existsSync(distPath);

if (isProduction) {
  console.log('[Aura Global] Serving static production build from AuraTheme/dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
} else {
  console.log('[Aura Global] Initializing Vite development middleware on port ' + PORT);
  const vite = await createViteServer({
    root: path.resolve(__dirname, 'AuraTheme'),
    server: {
      middlewareMode: true,
      hmr: false,
    },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Aura Global] Server listening at http://0.0.0.0:${PORT}`);

  // Start Telegram bot long-polling if token configured
  try {
    const bot = require('./API/app/services/telegramBot.service.js');
    if (process.env.TELEGRAM_BOT_TOKEN && bot && typeof bot.start === 'function') {
      bot.start({
        onStart: (botInfo) => console.log(`[Telegram Bot] @${botInfo.username} online and ready!`),
      }).catch((err) => console.warn('[Telegram Bot] Polling warning:', err.message));
    } else {
      console.log('[Telegram Bot] Ready: TELEGRAM_BOT_TOKEN not set in environment (mock/local testing active)');
    }
  } catch (err) {
    console.warn('[Telegram Bot] Initialization notice:', err.message);
  }
});
