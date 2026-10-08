const { Bot, InlineKeyboard, Keyboard } = require('grammy');
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

// Persistent Reply Keyboard Bar for Telegram Chat Interface (with "Show All Stores" bar)
const showAllStoresReplyKeyboard = new Keyboard()
  .text('🏬 Show All Stores')
  .row()
  .text('☕ Aura Coffee')
  .text('🥐 Aura Bakery')
  .text('📱 Nexus Mobile')
  .resized()
  .persistent();

// Master Available Stores Catalog across 8 Merchants:
// - Merchant 'Yin' owns 2 stores: 'sbc-store' & 'aura-bakery'
// - 7 other merchants own 1 store each (one store one merchant)
const ALL_AVAILABLE_STORES = [
  { slug: 'sbc-store', name: 'Aura Specialty Coffee', emoji: '☕', merchant: 'Yin', tagline: 'Artisan Highland Roasts & Specialty Espresso' },
  { slug: 'aura-bakery', name: 'Aura Artisan Bakery', emoji: '🥐', merchant: 'Yin', tagline: 'Fresh Sourdough, Viennoiserie & Pastries' },
  { slug: 'aura-bistro', name: 'Aura French Bistro', emoji: '🍽️', merchant: 'Pierre Dubois', tagline: 'Classical French Gastronomy, Burgers & Steaks' },
  { slug: 'aura-lounge', name: 'Botanical Lounge & Matcha', emoji: '🍵', merchant: 'Kenji Sato', tagline: 'Ceremonial Matcha, Herbal Tonics & Teas' },
  { slug: 'nexus-mobile', name: 'Nexus Mobile & Gadgets', emoji: '📱', merchant: 'Alex Chen', tagline: 'Smartphones, Audio & Mobile Tech' },
  { slug: 'aura-tech', name: 'Aura Automation Tech', emoji: '💻', merchant: 'David Kim', tagline: 'Smart Living, Workstations & Accessories' },
  { slug: 'apex-pc', name: 'Apex PC & Workstation Hub', emoji: '🖥️', merchant: 'Elena Rostova', tagline: 'High-Performance Desktops & Computing' },
  { slug: 'velour-apparel', name: 'Velour Minimalist Apparel', emoji: '👔', merchant: 'Marcus Vance', tagline: 'Contemporary Fashion & Tailoring' },
];

if (botToken) {
  bot = new Bot(botToken);

  // Automatically enforce clean official bot description (strictly NO promotional lines)
  // and configure persistent "Show All Stores" menu button bar
  (async () => {
    try {
      // 1. Enforce clean description without promo text
      await bot.api.setMyDescription(
        'Official Aura Global E-Menu & Ordering Bot. Browse menus, order food & beverages, and receive real-time kitchen updates.'
      );
      await bot.api.setMyDescription(
        'Official Aura Global E-Menu & Ordering Bot. Browse menus, order food & beverages, and receive real-time kitchen updates.',
        { language_code: 'en' }
      );
      await bot.api.setMyShortDescription(
        'Aura Global E-Menu & Instant Telegram Ordering'
      );
      await bot.api.setMyShortDescription(
        'Aura Global E-Menu & Instant Telegram Ordering',
        { language_code: 'en' }
      );

      // 2. Set persistent "Show All Stores" Bar in the chat interface
      await bot.api.setChatMenuButton({
        menu_button: {
          type: 'web_app',
          text: 'Show All Stores',
          web_app: { url: `${webAppBaseUrl}/shop` },
        },
      });

      // 3. Register official bot commands
      await bot.api.setMyCommands([
        { command: 'stores', description: 'Show All Stores' },
        { command: 'shops', description: 'Show All Stores' },
        { command: 'start', description: 'Start Bot & Show Stores' },
        { command: 'orders', description: 'View My Orders' },
        { command: 'help', description: 'How to use Aura E-Menu' },
      ]);
    } catch (e) {
      console.warn('[Telegram Bot] Initialization sync notice:', e.message);
    }
  })();

  // Anti-Spam Middleware: Automatically drop & delete any spam links/promos
  bot.use(async (ctx, next) => {
    const text = ctx.message?.text || ctx.message?.caption || '';
    if (text) {
      const lower = text.toLowerCase();
      if (
        lower.includes('chatprovider_bot') ||
        lower.includes('ref_c39') ||
        lower.includes('chatgpt') ||
        lower.includes('xaitool') ||
        lower.includes('generai.org') ||
        lower.includes('undress') ||
        lower.includes('porn')
      ) {
        try {
          if (ctx.chat && ctx.message?.message_id) {
            await ctx.api.deleteMessage(ctx.chat.id, ctx.message.message_id);
          }
        } catch (_) {}
        return; // Halt processing spam messages
      }
    }
    return next();
  });

  // Reusable helper to display all available stores
  async function showAllStoresHandler(ctx) {
    // Ensure the "Show All Stores" web app menu button is set for this chat
    try {
      await ctx.api.setChatMenuButton({
        chat_id: ctx.chat.id,
        menu_button: {
          type: 'web_app',
          text: 'Show All Stores',
          web_app: { url: `${webAppBaseUrl}/shop` },
        },
      });
    } catch (_) {}

    const keyboard = new InlineKeyboard();

    // Top primary action bar: Open Full Stores Directory
    keyboard
      .webApp('🏬 Open Full Stores Directory (Web App)', `${webAppBaseUrl}/shop`)
      .row();

    // Individual store buttons (2 per row for easy mobile tapping)
    ALL_AVAILABLE_STORES.forEach((s, idx) => {
      keyboard.webApp(`${s.emoji} ${s.name}`, `${webAppBaseUrl}/shop/${s.slug}`);
      if (idx % 2 === 1) keyboard.row();
    });

    if (ALL_AVAILABLE_STORES.length % 2 !== 0) keyboard.row();

    keyboard
      .webApp('📋 My Orders & Receipts', `${webAppBaseUrl}/shop/sbc-store`)
      .row()
      .webApp('🌐 Browse Global Website', `${webAppBaseUrl}/`);

    const messageText =
      `🏪 **Aura Global — All 8 Merchants & Stores:**\n\n` +
      `Browse menus, order online, or switch between stores directly inside Telegram:\n\n` +
      ALL_AVAILABLE_STORES.map(
        (s, idx) => `${idx + 1}. ${s.emoji} **${s.name}** (Merchant: *${s.merchant}*)\n   _${s.tagline}_\n`
      ).join('\n') +
      `\n👇 *Tap any store below or use the "Show All Stores" bar anytime:*`;

    return ctx.reply(messageText, {
      reply_markup: keyboard,
      parse_mode: 'Markdown',
    });
  }

  // Helper to register user and send credentials directly to their personal chat
  async function registerAndSendCredentials(ctx, token = 'auth_telegram') {
    try {
      const TelegramAuthController = require('../controller/tma/telegramAuth.controller');
      const result = await TelegramAuthController.handleBotStartAuth(token, ctx.from);
      if (result) {
        const { credentials } = result;
        const keyboard = new InlineKeyboard()
          .webApp('🌐 Open Aura Global Website', `${webAppBaseUrl}/login?user=${credentials.username}`)
          .row()
          .webApp('🏬 Show All Stores', `${webAppBaseUrl}/shop`);

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
    // Ensure "Show All Stores" menu button bar is active in chat
    try {
      await ctx.api.setChatMenuButton({
        chat_id: ctx.chat.id,
        menu_button: {
          type: 'web_app',
          text: 'Show All Stores',
          web_app: { url: `${webAppBaseUrl}/shop` },
        },
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
      const webMenuUrl = `${webAppBaseUrl}/shop/${targetStoreSlug}`;

      const keyboard = new InlineKeyboard()
        .webApp(`🛍️ Open ${storeName}`, webMenuUrl)
        .row()
        .webApp('🏬 Show All Stores', `${webAppBaseUrl}/shop`)
        .row()
        .webApp('📋 My Orders & Receipts', `${webAppBaseUrl}/shop/${targetStoreSlug}`);

      return ctx.reply(
        `👋 Welcome to *${storeName}*!\n\n` +
        `Browse our full catalog, customize your order, and submit it directly to our kitchen staff with real-time Telegram notifications.\n\n` +
        `Tap below to launch the Telegram E-Menu:`,
        { reply_markup: keyboard, parse_mode: 'Markdown' }
      );
    }

    // Default welcome: Provide Show All Stores Bar + Direct links
    const keyboard = new InlineKeyboard();

    keyboard
      .webApp('🏬 Show All Stores', `${webAppBaseUrl}/shop`)
      .row();

    ALL_AVAILABLE_STORES.slice(0, 6).forEach((s, idx) => {
      keyboard.webApp(`${s.emoji} ${s.name}`, `${webAppBaseUrl}/shop/${s.slug}`);
      if (idx % 2 === 1) keyboard.row();
    });

    if (ALL_AVAILABLE_STORES.slice(0, 6).length % 2 !== 0) keyboard.row();

    keyboard
      .webApp('📋 My Orders & Receipts', `${webAppBaseUrl}/shop/sbc-store`)
      .row()
      .webApp('🌐 Browse Global Website', `${webAppBaseUrl}/`);

    await ctx.reply(
      `👋 **Welcome to Aura Global E-Menu & Telegram Mini App!**\n\n` +
      `Choose a store below or tap the **"Show All Stores"** bar anytime to open our interactive Telegram Mini App directory:\n\n` +
      ALL_AVAILABLE_STORES.map((s, idx) => `${idx + 1}. ${s.emoji} *${s.name}* — ${s.tagline}`).join('\n') +
      `\n\n_Use the bottom bar or keyboard to switch stores anytime._`,
      { reply_markup: keyboard, parse_mode: 'Markdown' }
    );

    // Send persistent reply keyboard bar for quick access
    return ctx.reply('👇 *Quick Bar: Tap "Show All Stores" below to view all stores:*', {
      reply_markup: showAllStoresReplyKeyboard,
      parse_mode: 'Markdown',
    });
  });

  // Command: /shops or /stores -> Displays All Stores
  bot.command(['shops', 'stores'], showAllStoresHandler);

  // User message trigger for "Show All Stores" bar button
  bot.hears([
    '🏬 Show All Stores',
    'Show All Stores',
    /show all stores/i,
    /all stores/i,
    /^stores$/i,
    /^shops$/i,
  ], showAllStoresHandler);

  // Callback query trigger
  bot.callbackQuery('show_all_stores', async (ctx) => {
    await ctx.answerCallbackQuery();
    return showAllStoresHandler(ctx);
  });

  // Quick reply keyboard shortcuts for individual stores
  bot.hears(/Aura Coffee/i, (ctx) => {
    const kb = new InlineKeyboard()
      .webApp('☕ Open Aura Coffee', `${webAppBaseUrl}/shop/sbc-store`)
      .row()
      .webApp('🏬 Show All Stores', `${webAppBaseUrl}/shop`);
    return ctx.reply('☕ *Aura Specialty Coffee*\nArtisan highland roasts and espresso.', {
      reply_markup: kb,
      parse_mode: 'Markdown',
    });
  });

  bot.hears(/Aura Bakery/i, (ctx) => {
    const kb = new InlineKeyboard()
      .webApp('🥐 Open Aura Bakery', `${webAppBaseUrl}/shop/aura-bakery`)
      .row()
      .webApp('🏬 Show All Stores', `${webAppBaseUrl}/shop`);
    return ctx.reply('🥐 *Aura Artisan Bakery*\nFresh sourdough, viennoiserie, and pastries.', {
      reply_markup: kb,
      parse_mode: 'Markdown',
    });
  });

  bot.hears(/Nexus Mobile/i, (ctx) => {
    const kb = new InlineKeyboard()
      .webApp('📱 Open Nexus Mobile', `${webAppBaseUrl}/shop/nexus-mobile`)
      .row()
      .webApp('🏬 Show All Stores', `${webAppBaseUrl}/shop`);
    return ctx.reply('📱 *Nexus Mobile & Gadgets*\nSmartphones, audio gear, and accessories.', {
      reply_markup: kb,
      parse_mode: 'Markdown',
    });
  });

  // Command: /orders
  bot.command('orders', async (ctx) => {
    const keyboard = new InlineKeyboard()
      .webApp('📋 View My Past Orders', `${webAppBaseUrl}/shop/sbc-store`)
      .row()
      .webApp('🏬 Show All Stores', `${webAppBaseUrl}/shop`);

    await ctx.reply(
      `🧾 **Your Past Orders & Receipts**\n\n` +
      `Check your live order statuses, order items, and delivery table information by launching the receipt viewer:`,
      { reply_markup: keyboard, parse_mode: 'Markdown' }
    );
  });

  // Command: /help
  bot.command('help', async (ctx) => {
    const keyboard = new InlineKeyboard()
      .webApp('🏬 Show All Stores', `${webAppBaseUrl}/shop`);

    await ctx.reply(
      `ℹ️ **How to use Aura E-Menu Mini App:**\n\n` +
      `1️⃣ Tap the **Show All Stores** bar or send /stores to view all stores.\n` +
      `2️⃣ Tap any store button to open the instant Telegram Mini App.\n` +
      `3️⃣ Add food, drinks, or gadgets to your cart.\n` +
      `4️⃣ Enter your table number or delivery address and tap **Place Order**.\n` +
      `5️⃣ The store's staff Telegram group receives the order instantly with customer contact and item breakdown!\n` +
      `6️⃣ Tap **My Orders** in the app to follow order preparation status.`,
      { reply_markup: keyboard, parse_mode: 'Markdown' }
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
