const axios = require('axios');

// In-memory queue of recent telegram order notifications dispatched to shop groups
const recentDispatches = [];

/**
 * Formats and sends an order notification directly to the shop's Telegram group
 */
async function sendOrderToShopGroup({ store, order, customer = {}, items = [] }) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const targetGroupId = store.telegram_group_id || process.env.TELEGRAM_GROUP_CHAT_ID;
  const storeName = store.company || store.name || 'Store';
  const groupName = store.telegram_group_name || `${storeName} Staff Group`;

  const orderTime = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const itemsListFormatted = items.map((item, idx) => {
    const qty = item.qty || item.quantity || 1;
    const price = Number(item.price || item.unit_price || 0);
    const subtotal = Number(item.subtotal || qty * price);
    const name = item.name || item.product_name || `Item #${item.id || idx + 1}`;
    return `  <b>${idx + 1}. ${name}</b> x${qty} — <b>$${subtotal.toFixed(2)}</b> ($${price.toFixed(2)} ea)`;
  }).join('\n');

  const grandTotal = Number(order.grandTotal || order.total || 0).toFixed(2);
  const currencySymbol = store.currency_symbol || '$';

  // Rich HTML message formatted for Telegram group readability
  const messageText = [
    `🔔 <b>NEW SHOP ORDER RECEIVED!</b>`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `🏪 <b>Shop:</b> ${storeName}`,
    `🔖 <b>Order Ref:</b> <code>${order.referenceNo || 'TMA-' + Date.now()}</code>`,
    `🕒 <b>Time:</b> ${orderTime}`,
    ``,
    `👤 <b>Customer:</b> ${customer.name || customer.customerName || 'Telegram Customer'}`,
    customer.phone ? `📞 <b>Phone:</b> ${customer.phone}` : null,
    customer.address ? `📍 <b>Table / Delivery:</b> ${customer.address}` : null,
    customer.note ? `📝 <b>Order Note:</b> <i>${customer.note}</i>` : null,
    ``,
    `📦 <b>Order Items (${items.length}):</b>`,
    itemsListFormatted,
    ``,
    `━━━━━━━━━━━━━━━━━━━━`,
    `💰 <b>TOTAL TO COLLECT: ${currencySymbol}${grandTotal}</b>`,
    `⚡ <i>Status: Pending Preparation</i>`
  ].filter(Boolean).join('\n');

  const dispatchRecord = {
    id: `disp-${Date.now()}`,
    orderRef: order.referenceNo,
    storeId: store.id,
    storeName: storeName,
    targetGroupId: targetGroupId || 'Simulated Shop Group',
    groupName: groupName,
    timestamp: new Date().toISOString(),
    messageText,
    sent: false,
    channel: 'Telegram Bot Group Broadcast'
  };

  if (botToken && targetGroupId) {
    try {
      const response = await axios.post(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          chat_id: targetGroupId,
          text: messageText,
          parse_mode: 'HTML'
        },
        { timeout: 5000 }
      );

      if (response.data && response.data.ok) {
        dispatchRecord.sent = true;
        dispatchRecord.telegramMessageId = response.data.result?.message_id;
        console.log(`[Telegram Group Dispatch] Successfully sent order ${order.referenceNo} to ${groupName} (${targetGroupId})`);
      }
    } catch (err) {
      console.warn(`[Telegram Group Dispatch] Telegram API notice (${err.response?.data?.description || err.message}). Order recorded in local queue.`);
      dispatchRecord.sent = false;
      dispatchRecord.error = err.response?.data?.description || err.message;
    }
  } else {
    dispatchRecord.sent = true;
    dispatchRecord.simulated = true;
    console.log(`[Telegram Group Dispatch (Simulated)] Order ${order.referenceNo} dispatched to ${groupName}: \n${messageText}`);
  }

  recentDispatches.unshift(dispatchRecord);
  if (recentDispatches.length > 50) recentDispatches.pop();

  return dispatchRecord;
}

function getRecentDispatches() {
  return recentDispatches;
}

module.exports = {
  sendOrderToShopGroup,
  getRecentDispatches
};
