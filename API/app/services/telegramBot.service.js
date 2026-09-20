const { Bot, InlineKeyboard } = require('grammy');
const EMenuModel = require('../models/emenu.model');

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const webAppBaseUrl = process.env.WEBAPP_URL || 'http://localhost:5173';

let bot = null;

if (botToken) {
  bot = new Bot(botToken);

  bot.command('start', async (ctx) => {
    const rawParam = ctx.match || ''; // e.g. "store_seller-2" or "biller_15"
    let targetStoreSlug = null;

    if (rawParam.startsWith('store_')) {
      targetStoreSlug = rawParam.replace('store_', '');
    } else if (rawParam.startsWith('biller_')) {
      const billerId = rawParam.replace('biller_', '');
      const store = await EMenuModel.getStoreByBillerId(billerId);
      if (store) targetStoreSlug = store.slug;
    } else if (rawParam) {
      // Raw slug fallback
      targetStoreSlug = rawParam;
    }

    const destinationUrl = targetStoreSlug 
      ? `${webAppBaseUrl}/shop/${targetStoreSlug}` 
      : `${webAppBaseUrl}/shop/not-found`;

    const keyboard = new InlineKeyboard().webApp(
      targetStoreSlug ? 'Open Store Menu' : 'Open Catalog',
      destinationUrl
    );

    await ctx.reply(
      targetStoreSlug 
        ? `Welcome! Click the button below to view the menu for **${targetStoreSlug}**.` 
        : 'Welcome! Please open the app via a store link.',
      { reply_markup: keyboard, parse_mode: 'Markdown' }
    );
  });

  bot.start({
    onStart: (botInfo) => console.log(`Telegram Bot @${botInfo.username} running`)
  });
}

module.exports = bot;