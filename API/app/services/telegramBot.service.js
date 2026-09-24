const { Bot, InlineKeyboard } = require('grammy');
const EMenuModel = require('../models/emenu.model');
const simpleData = require('../../../data/simpleData');

const botToken = process.env.TELEGRAM_BOT_TOKEN;
// Telegram Mini Apps strictly require HTTPS URLs
const webAppBaseUrl = (
  process.env.WEBAPP_URL ||
  process.env.PUBLIC_APP_URL ||
  'https://ais-dev-td6tu5gqrfllupsasnufaq-616191327265.asia-east1.run.app'
).replace(/\/$/, '');

let bot = null;

if (botToken) {
  bot = new Bot(botToken);

  // Command: /start [param]
  bot.command('start', async (ctx) => {
    const rawParam = (ctx.match || '').trim();
    let targetStoreSlug = null;

    if (rawParam.startsWith('store_')) {
      targetStoreSlug = rawParam.replace('store_', '');
    } else if (rawParam.startsWith('biller_')) {
      const billerId = rawParam.replace('biller_', '');
      const store = await EMenuModel.getStoreByBillerId(billerId);
      if (store) targetStoreSlug = store.slug;
    } else if (rawParam) {
      targetStoreSlug = rawParam;
    }

    if (targetStoreSlug) {
      const store = await EMenuModel.getStoreBySlug(targetStoreSlug);
      const storeName = store ? (store.name || store.company) : targetStoreSlug;
      const destinationUrl = `${webAppBaseUrl}/shop/${targetStoreSlug}`;

      const keyboard = new InlineKeyboard()
        .webApp(`🛍️ Open ${storeName} Menu`, destinationUrl)
        .row()
        .webApp('📋 My Orders', `${webAppBaseUrl}/tma/${targetStoreSlug}`)
        .row()
        .webApp('🏪 View All Shops', `${webAppBaseUrl}/shop`);

      return ctx.reply(
        `👋 Welcome to *${storeName}*!\n\n` +
        `Browse our full catalog, customize your order, and submit it directly to our kitchen staff with real-time Telegram notifications.\n\n` +
        `Tap below to launch the Mini App:`,
        { reply_markup: keyboard, parse_mode: 'Markdown' }
      );
    }

    // Default multi-shop selector menu
    const rawStores = simpleData.default ? simpleData.default.stores : (simpleData.stores || []);
    const keyboard = new InlineKeyboard();

    rawStores.forEach((s) => {
      keyboard.webApp(`☕ ${s.name}`, `${webAppBaseUrl}/shop/${s.slug}`).row();
    });

    keyboard
      .webApp('📋 My Orders & Receipts', `${webAppBaseUrl}/tma/sbc-store`)
      .row()
      .webApp('🌐 Browse Global Portal', `${webAppBaseUrl}/`);

    await ctx.reply(
      `👋 **Welcome to Aura Global E-Menu & Telegram Mini App!**\n\n` +
      `Choose a shop below to open our interactive digital menu, place orders for dine-in or takeaway, and track order fulfillment:`,
      { reply_markup: keyboard, parse_mode: 'Markdown' }
    );
  });

  // Command: /shops
  bot.command(['shops', 'stores'], async (ctx) => {
    const rawStores = simpleData.default ? simpleData.default.stores : (simpleData.stores || []);
    const keyboard = new InlineKeyboard();

    rawStores.forEach((s) => {
      keyboard.webApp(`🛍️ ${s.name}`, `${webAppBaseUrl}/shop/${s.slug}`).row();
    });

    await ctx.reply(
      `🏪 **Available Aura Partner Shops:**\n\n` +
      rawStores.map((s, idx) => `${idx + 1}. *${s.name}* — ${s.tagline}`).join('\n') +
      `\n\nTap a shop below to open its Mini App menu:`,
      { reply_markup: keyboard, parse_mode: 'Markdown' }
    );
  });

  // Command: /orders
  bot.command('orders', async (ctx) => {
    const keyboard = new InlineKeyboard().webApp(
      '📋 View My Past Orders',
      `${webAppBaseUrl}/tma/sbc-store`
    );

    await ctx.reply(
      `🧾 **Your Past Orders & Receipts**\n\n` +
      `Check your live order statuses, order items, and delivery table information by launching the receipt viewer:`,
      { reply_markup: keyboard, parse_mode: 'Markdown' }
    );
  });

  // Command: /help
  bot.command('help', async (ctx) => {
    await ctx.reply(
      `ℹ️ **How to use Aura E-Menu Mini App:**\n\n` +
      `1️⃣ Send /shops to see all partner shops.\n` +
      `2️⃣ Tap any shop button to open the instant Telegram Mini App.\n` +
      `3️⃣ Add food, drinks, or beans to your cart.\n` +
      `4️⃣ Enter your table number or delivery address and tap **Place Order**.\n` +
      `5️⃣ The shop's kitchen/staff Telegram group receives the order instantly with customer contact and item breakdown!\n` +
      `6️⃣ Tap **My Orders** in the app to follow order preparation status.`,
      { parse_mode: 'Markdown' }
    );
  });

  bot.catch((err) => {
    console.warn(`[Telegram Bot] Error: ${err.message}`);
  });
}

module.exports = bot;
