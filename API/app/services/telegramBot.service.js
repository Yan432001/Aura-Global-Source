const { Bot, InlineKeyboard } = require("grammy");
const db = require("../config/utill/connection");

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

/**
 * Send an interactive notification to the merchant's Telegram Chat
 */
async function notifyStoreOwner(store, order) {
  if (!store.telegramChatId) {
    console.warn(`[TMA Alert] No telegram_chat_id mapped for store: ${store.name}`);
    return;
  }

  const itemsList = order.items
    .map((item) => `• ${item.productName} (x${item.quantity}) - $${Number(item.subtotal).toFixed(2)}`)
    .join("\n");

  const message =
    `🛍️ *New Order Received!*\n` +
    `*Store:* ${store.name}\n` +
    `*Order Ref:* \`${order.referenceNo}\`\n\n` +
    `*Order Items:*\n${itemsList}\n\n` +
    `*Total:* $${Number(order.totalAmount).toFixed(2)}\n` +
    `*Customer:* ${order.customerName} (${order.customerPhone})\n` +
    `*Delivery Address:* ${order.shippingAddress}`;

  const keyboard = new InlineKeyboard()
    .text("✅ Accept", `order_accept:${order.id}`)
    .text("❌ Reject", `order_reject:${order.id}`);

  try {
    await bot.api.sendMessage(store.telegramChatId, message, {
      parse_mode: "Markdown",
      reply_markup: keyboard,
    });
  } catch (err) {
    console.error("[Telegram Bot Error] Failed to send message:", err.message);
  }
}

// Handle Accept/Reject action clicks
bot.callbackQuery(/^order_(accept|reject):(\d+)$/, async (ctx) => {
  const action = ctx.match[1];
  const orderId = ctx.match[2];
  const newStatus = action === "accept" ? "completed" : "canceled";

  try {
    await db.query("UPDATE aura_sales SET sale_status = ? WHERE id = ?", [newStatus, orderId]);
    await ctx.answerCallbackQuery({ text: `Order marked as ${newStatus}` });
    await ctx.editMessageReplyMarkup(undefined);
    await ctx.reply(`Order \`#${orderId}\` status changed to *${newStatus.toUpperCase()}*`, { parse_mode: "Markdown" });
  } catch (error) {
    console.error("Callback query error:", error);
    await ctx.answerCallbackQuery({ text: "Failed to update order" });
  }
});

module.exports = { bot, notifyStoreOwner };