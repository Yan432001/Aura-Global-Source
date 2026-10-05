const { Bot, InlineKeyboard } = require('grammy');
const EMenuModel = require('../models/emenu.model');
const simpleData = require('../../../data/simpleData');

const botToken = process.env.TELEGRAM_BOT_TOKEN || '8613686625:AAFe8-04LvQumEXZ8-MBjbNSDozba3E1lCw';
// Telegram Mini Apps strictly require HTTPS URLs
const webAppBaseUrl = (
  process.env.WEBAPP_URL ||
  process.env.PUBLIC_APP_URL ||
  'https://ais-pre-td6tu5gqrfllupsasnufaq-616191327265.asia-east1.run.app'
).replace(/\/$/, '');

let bot = null;

if (botToken) {
  bot = new Bot(botToken);

  // Helper to register user and send credentials directly to their personal chat
  async function registerAndSendCredentials(ctx, token = 'auth_telegram') {
    try {
      // Remove the "Open E-Menu" web app menu button for this chat
      try {
        await ctx.api.setChatMenuButton({
          chat_id: ctx.chat.id,
          menu_button: { type: 'commands' }
        });
      } catch (_) {}

      const TelegramAuthController = require('../controller/tma/telegramAuth.controller');
      const result = await TelegramAuthController.handleBotStartAuth(token, ctx.from);
      if (result) {
        const { credentials } = result;
        // Only include "Open Aura Global Website" button (deleted "Order from Menu")
        const keyboard = new InlineKeyboard()
          .webApp('🌐 Open Aura Global Website', `${webAppBaseUrl}/login?user=${credentials.username}`);

        return ctx.reply(
          `🎉 <b>Welcome to Aura Global, ${ctx.from.first_name || 'Member'}!</b>\n\n` +
          `Your member account has been registered in our database via Telegram Bot.\n\n` +
          `🔑 <b>Your Account Login Credentials:</b>\n` +
          `• <b>Username:</b> <code>${credentials.username}</code>\n` +
          `• <b>Password:</b> <code>${credentials.password}</code>\n` +
          `• <b>Telegram ID:</b> <code>${ctx.from.id}</code>\n\n` +
          `✨ <b>Account Privileges:</b>\n` +
          `• 🎁 <b>150 VIP Welcome Loyalty Points</b> credited!\n` +
          `• 🧾 Digital order receipts & fulfillment updates sent directly to this chat.\n\n` +
          `<i>Tap below to open the website logged in:</i>`,
          { reply_markup: keyboard, parse_mode: 'HTML' }
        );
      }
    } catch (authErr) {
      console.warn('[Telegram Bot] Auth handling notice:', authErr.message);
    }
  }

  // Command: /start [param]
  bot.command('start', async (ctx) => {
    // Reset chat menu button to standard commands menu
    try {
      await ctx.api.setChatMenuButton({
        chat_id: ctx.chat.id,
        menu_button: { type: 'commands' }
      });
    } catch (_) {}

    const rawParam = (ctx.match || '').trim();
    let targetStoreSlug = null;

    // Check if start parameter is an authentication / registration session token
    if (rawParam.startsWith('auth_') || rawParam.startsWith('reg_') || rawParam === 'register' || rawParam === 'login') {
      return registerAndSendCredentials(ctx, rawParam);
    }

    if (rawParam.startsWith('shop_')) {
      targetStoreSlug = rawParam.replace('shop_', '');
    } else if (rawParam.startsWith('store_')) {
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
      const tmaUrl = `${webAppBaseUrl}/tma/${targetStoreSlug}`;
      const webMenuUrl = `${webAppBaseUrl}/shop/${targetStoreSlug}`;

      const keyboard = new InlineKeyboard()
        .webApp(`🛍️ Open ${storeName} (Mini App)`, tmaUrl)
        .row()
        .webApp('🌐 Open Web E-Menu', webMenuUrl)
        .row()
        .webApp('📋 My Orders & Receipts', `${webAppBaseUrl}/tma/${targetStoreSlug}`);

      return ctx.reply(
        `👋 Welcome to *${storeName}*!\n\n` +
        `Browse our full catalog, customize your order, and submit it directly to our kitchen staff with real-time Telegram notifications.\n\n` +
        `Tap below to launch the Telegram Mini App:`,
        { reply_markup: keyboard, parse_mode: 'Markdown' }
      );
    }

    // Curated Aura Global Flagship Stores (Filter out mock UI concept stores like stride-carry)
    const AURA_FLAGSHIP_SLUGS = ['sbc-store', 'aura-bakery', 'aura-bistro', 'aura-lounge', 'aura-tech'];
    const rawStores = simpleData.default ? simpleData.default.stores : (simpleData.stores || []);
    const flagshipStores = rawStores.filter((s) => AURA_FLAGSHIP_SLUGS.includes(s.slug));

    const keyboard = new InlineKeyboard();

    flagshipStores.forEach((s) => {
      keyboard.webApp(`☕ ${s.name}`, `${webAppBaseUrl}/tma/${s.slug}`).row();
    });

    keyboard
      .webApp('📋 My Orders & Receipts', `${webAppBaseUrl}/tma/sbc-store`)
      .row()
      .webApp('🌐 Browse Global Website', `${webAppBaseUrl}/`);

    await ctx.reply(
      `👋 **Welcome to Aura Global E-Menu & Telegram Mini App!**\n\n` +
      `Choose an authentic Aura flagship store below to open our interactive Telegram Mini App:\n\n` +
      flagshipStores.map((s, idx) => `${idx + 1}. *${s.name}* — ${s.tagline}`).join('\n') +
      `\n\n_Note: Demo mock stores (like Stride & Carry) are UI concepts only and excluded from live Telegram ordering._`,
      { reply_markup: keyboard, parse_mode: 'Markdown' }
    );
  });

  // Command: /shops
  bot.command(['shops', 'stores'], async (ctx) => {
    const AURA_FLAGSHIP_SLUGS = ['sbc-store', 'aura-bakery', 'aura-bistro', 'aura-lounge', 'aura-tech'];
    const rawStores = simpleData.default ? simpleData.default.stores : (simpleData.stores || []);
    const flagshipStores = rawStores.filter((s) => AURA_FLAGSHIP_SLUGS.includes(s.slug));

    const keyboard = new InlineKeyboard();

    flagshipStores.forEach((s) => {
      keyboard.webApp(`🛍️ ${s.name} (TMA)`, `${webAppBaseUrl}/tma/${s.slug}`).row();
    });

    await ctx.reply(
      `🏪 **Aura Global Active Stores:**\n\n` +
      flagshipStores.map((s, idx) => `${idx + 1}. *${s.name}* — ${s.tagline}`).join('\n') +
      `\n\nTap a shop below to open in Telegram Mini App:`,
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

  // Command: /register (or callback query)
  bot.command('register', async (ctx) => {
    return registerAndSendCredentials(ctx, 'auth_register_cmd');
  });

  bot.callbackQuery('register_user', async (ctx) => {
    await ctx.answerCallbackQuery();
    return registerAndSendCredentials(ctx, 'auth_register_cb');
  });

  bot.catch((err) => {
    const errorMsg = err?.error?.message || err?.message || String(err);
    if (errorMsg.includes('409') || errorMsg.includes('Conflict') || errorMsg.includes('terminated by other getUpdates')) {
      console.log('[Telegram Bot] 409 Conflict: Another bot runner is actively polling. Local polling stopped gracefully.');
      try {
        bot.stop();
      } catch (_) {}
      return;
    }
    console.log(`[Telegram Bot] Notice: ${errorMsg}`);
  });
}

module.exports = bot;
