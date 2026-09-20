require('dotenv').config();
const { Bot, InlineKeyboard } = require('grammy');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8643956334:AAE91Unzq3DmkZkr-U-w91LLOlauSRvbJIU';
const WEBAPP_URL = process.env.WEBAPP_URL || 'https://aluminium-letters-shapes-santa.trycloudflare.com/';

if (!BOT_TOKEN) {
  console.error('ERROR: TELEGRAM_BOT_TOKEN is missing from your environment.');
  process.exit(1);
}

const bot = new Bot(BOT_TOKEN);

/**
 * Handle /start with deep linking
 * Formats supported:
 *  - /start store_seller-2
 *  - /start biller_3
 *  - /start (generic fallback)
 */
bot.command('start', async (ctx) => {
  const payload = (ctx.match || '').trim();

  let targetUrl = `${WEBAPP_URL}/tg`;
  let buttonTitle = 'Open Store Menu';
  let storeIdentifierText = 'our multi-store marketplace';

  if (payload) {
    if (payload.startsWith('store_')) {
      const storeSlug = payload.replace('store_', '');
      targetUrl = `${WEBAPP_URL}/shop/${encodeURIComponent(storeSlug)}`;
      buttonTitle = `View ${storeSlug} Menu`;
      storeIdentifierText = `store "${storeSlug}"`;
    } else if (payload.startsWith('biller_')) {
      const billerId = payload.replace('biller_', '');
      targetUrl = `${WEBAPP_URL}/shop/by-biller/${encodeURIComponent(billerId)}`;
      buttonTitle = `View Store #${billerId} Menu`;
      storeIdentifierText = `Biller Store #${billerId}`;
    } else {
      // Fallback for raw IDs or slugs passed directly
      targetUrl = `${WEBAPP_URL}/shop/${encodeURIComponent(payload)}`;
      buttonTitle = `Open ${payload} Menu`;
      storeIdentifierText = `store "${payload}"`;
    }
  }

  // Inline WebApp Button
  const keyboard = new InlineKeyboard().webApp(buttonTitle, targetUrl);

  const welcomeMessage = [
    `👋 Hello, *${ctx.from?.first_name || 'Customer'}*!`,
    `Welcome to the E-Menu for ${storeIdentifierText}.`,
    '',
    `Tap the button below to browse products, select your items, and place your order:`
  ].join('\n');

  await ctx.reply(welcomeMessage, {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  });
});

// Help command
bot.command('help', async (ctx) => {
  await ctx.reply(
    '💡 *How to use:*\n\n' +
    '• Tap the menu button at the bottom left to view the store.\n' +
    '• If you have a specific store link, tap the link shared by the merchant to open their personal menu.',
    { parse_mode: 'Markdown' }
  );
});

// Error handling
bot.catch((err) => {
  console.error(`Error while handling update ${err.ctx.update.update_id}:`, err.error);
});

// Start the bot
bot.start({
  onStart: (botInfo) => {
    console.log(`[Bot Online] Started @${botInfo.username}`);
    console.log(`[Web App URL] Configured to: ${WEBAPP_URL}`);
  }
});