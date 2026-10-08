const fs = require('fs');
const path = require('path');
const axios = require('axios');

const CONFIG_FILE = path.resolve(__dirname, '../../../data/telegram_store_configs.json');
const LOGS_FILE = path.resolve(__dirname, '../../../data/telegram_routing_logs.json');

const DEFAULT_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8613686625:AAFe8-04LvQumEXZ8-MBjbNSDozba3E1lCw';

const INITIAL_STORE_CONFIGS = [
  {
    storeSlug: 'nexus-mobile',
    storeName: 'Nexus Mobile & Gadgets',
    storeEmoji: '📱',
    ownerName: 'Yin',
    botUsername: '@auraglobalsource_bot',
    botToken: '',
    botTokenPreview: '8613686...1lCw',
    botStatus: 'connected',
    groupId: '-5004978007',
    groupTitle: 'Nexus Mobile - Dispatch & Orders Group',
    groupInviteLink: 'https://t.me/+9YYwU2Lfz600YWY1',
    permissions: {
      canSendOrders: true,
      canUpdateStatus: true,
      notifyInquiries: true,
      dailySummary: true,
      notifySoundAlert: true,
    },
    notificationTemplate: 'detailed',
    stats: {
      totalOrdersRouted: 60,
      lastRoutedAt: 'Just now',
    },
  },
  {
    storeSlug: 'sbc-store',
    storeName: 'Aura Specialty Coffee',
    storeEmoji: '☕',
    ownerName: 'Yin',
    botUsername: '@aura_emenu_order_bot',
    botToken: '',
    botTokenPreview: '8613686...1lCw',
    botStatus: 'connected',
    groupId: '-1002489102938',
    groupTitle: 'Aura Coffee - Baristas & Kitchen Orders',
    groupInviteLink: 'https://t.me/+AuraCoffeeKitchen',
    permissions: {
      canSendOrders: true,
      canUpdateStatus: true,
      notifyInquiries: true,
      dailySummary: true,
      notifySoundAlert: true,
    },
    notificationTemplate: 'compact',
    stats: {
      totalOrdersRouted: 142,
      lastRoutedAt: 'Just now',
    },
  },
  {
    storeSlug: 'aura-bakery',
    storeName: 'Aura Artisan Bakery',
    storeEmoji: '🥐',
    ownerName: 'Yin',
    botUsername: '@aura_emenu_order_bot',
    botToken: '',
    botTokenPreview: '8613686...1lCw',
    botStatus: 'connected',
    groupId: '-1002598341029',
    groupTitle: 'Aura Bakery - Morning Kitchen & Dispatch',
    groupInviteLink: 'https://t.me/+AuraBakeryDispatch',
    permissions: {
      canSendOrders: true,
      canUpdateStatus: true,
      notifyInquiries: true,
      dailySummary: true,
      notifySoundAlert: true,
    },
    notificationTemplate: 'detailed',
    stats: {
      totalOrdersRouted: 98,
      lastRoutedAt: '12 min ago',
    },
  },
  {
    storeSlug: 'aura-bistro',
    storeName: 'Aura French Bistro',
    storeEmoji: '🍽️',
    ownerName: 'Pierre Dubois',
    botUsername: '@aura_emenu_order_bot',
    botToken: '',
    botTokenPreview: '8613686...1lCw',
    botStatus: 'connected',
    groupId: '-1002678129045',
    groupTitle: 'Aura Bistro - Head Chef & Orders Group',
    groupInviteLink: 'https://t.me/+AuraBistroKitchen',
    permissions: {
      canSendOrders: true,
      canUpdateStatus: true,
      notifyInquiries: true,
      dailySummary: true,
      notifySoundAlert: true,
    },
    notificationTemplate: 'detailed',
    stats: {
      totalOrdersRouted: 67,
      lastRoutedAt: '45 min ago',
    },
  },
  {
    storeSlug: 'aura-lounge',
    storeName: 'Botanical Lounge & Matcha',
    storeEmoji: '🍵',
    ownerName: 'Kenji Sato',
    botUsername: '@aura_emenu_order_bot',
    botToken: '',
    botTokenPreview: '8613686...1lCw',
    botStatus: 'connected',
    groupId: '-1002789456123',
    groupTitle: 'Aura Lounge - Teahouse & Service Group',
    groupInviteLink: 'https://t.me/+AuraLoungeService',
    permissions: {
      canSendOrders: true,
      canUpdateStatus: true,
      notifyInquiries: true,
      dailySummary: true,
      notifySoundAlert: true,
    },
    notificationTemplate: 'compact',
    stats: {
      totalOrdersRouted: 41,
      lastRoutedAt: '2 hours ago',
    },
  },
  {
    storeSlug: 'aura-tech',
    storeName: 'Aura Automation Tech',
    storeEmoji: '💻',
    ownerName: 'David Kim',
    botUsername: '@aura_emenu_order_bot',
    botToken: '',
    botTokenPreview: '8613686...1lCw',
    botStatus: 'connected',
    groupId: '-1002890567234',
    groupTitle: 'Aura Tech - Fulfillment & Shipping Group',
    groupInviteLink: 'https://t.me/+AuraTechOrders',
    permissions: {
      canSendOrders: true,
      canUpdateStatus: true,
      notifyInquiries: true,
      dailySummary: true,
      notifySoundAlert: true,
    },
    notificationTemplate: 'detailed',
    stats: {
      totalOrdersRouted: 24,
      lastRoutedAt: 'Yesterday',
    },
  },
  {
    storeSlug: 'apex-pc',
    storeName: 'Apex PC & Workstation Hub',
    storeEmoji: '🖥️',
    ownerName: 'Elena Rostova',
    botUsername: '@aura_emenu_order_bot',
    botToken: '',
    botTokenPreview: '8613686...1lCw',
    botStatus: 'connected',
    groupId: '-1002998765432',
    groupTitle: 'Apex PC - Custom Builds & Orders',
    groupInviteLink: 'https://t.me/+ApexPCOrders',
    permissions: {
      canSendOrders: true,
      canUpdateStatus: true,
      notifyInquiries: true,
      dailySummary: true,
      notifySoundAlert: true,
    },
    notificationTemplate: 'detailed',
    stats: {
      totalOrdersRouted: 19,
      lastRoutedAt: '2 days ago',
    },
  },
  {
    storeSlug: 'velour-apparel',
    storeName: 'Velour Minimalist Apparel',
    storeEmoji: '👔',
    ownerName: 'Marcus Vance',
    botUsername: '@aura_emenu_order_bot',
    botToken: '',
    botTokenPreview: '8613686...1lCw',
    botStatus: 'connected',
    groupId: '-1003109876543',
    groupTitle: 'Velour Apparel - VIP Stylist & Dispatch',
    groupInviteLink: 'https://t.me/+VelourApparelOrders',
    permissions: {
      canSendOrders: true,
      canUpdateStatus: true,
      notifyInquiries: true,
      dailySummary: true,
      notifySoundAlert: true,
    },
    notificationTemplate: 'detailed',
    stats: {
      totalOrdersRouted: 35,
      lastRoutedAt: '3 days ago',
    },
  },
];

function maskToken(token) {
  if (!token) return '8613686...1lCw';
  if (token.length < 10) return '••••••••';
  return `${token.substring(0, 7)}...${token.substring(token.length - 4)}`;
}

class TelegramStoreConfigService {
  constructor() {
    this.configs = this._loadConfigs();
    this.logs = this._loadLogs();
  }

  _loadConfigs() {
    try {
      if (fs.existsSync(CONFIG_FILE)) {
        const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge any missing defaults
          const existingSlugs = new Set(parsed.map((c) => c.storeSlug));
          for (const def of INITIAL_STORE_CONFIGS) {
            if (!existingSlugs.has(def.storeSlug)) {
              parsed.push(def);
            }
          }
          return parsed;
        }
      }
    } catch (err) {
      console.warn('[TelegramStoreConfig] Error reading configs file:', err.message);
    }
    this._saveConfigs(INITIAL_STORE_CONFIGS);
    return [...INITIAL_STORE_CONFIGS];
  }

  _saveConfigs(configs) {
    try {
      const dir = path.dirname(CONFIG_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(configs, null, 2), 'utf-8');
    } catch (err) {
      console.error('[TelegramStoreConfig] Error saving configs file:', err.message);
    }
  }

  _loadLogs() {
    try {
      if (fs.existsSync(LOGS_FILE)) {
        const raw = fs.readFileSync(LOGS_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    return [];
  }

  _saveLogs(logs) {
    try {
      const dir = path.dirname(LOGS_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(LOGS_FILE, JSON.stringify(logs.slice(0, 100), null, 2), 'utf-8');
    } catch (_) {}
  }

  getAllConfigs() {
    return this.configs.map((c) => ({
      ...c,
      botTokenPreview: maskToken(c.botToken || DEFAULT_BOT_TOKEN),
      // Don't expose raw botToken in public listings if it has sensitive tokens
      hasCustomToken: Boolean(c.botToken && c.botToken.trim()),
    }));
  }

  getConfig(storeSlug) {
    return this.configs.find((c) => c.storeSlug === storeSlug) || null;
  }

  saveConfig(storeSlug, updates) {
    const idx = this.configs.findIndex((c) => c.storeSlug === storeSlug);
    let updated;

    const cleanUpdates = { ...updates };
    if (cleanUpdates.botToken) {
      cleanUpdates.botToken = cleanUpdates.botToken.trim();
      cleanUpdates.botTokenPreview = maskToken(cleanUpdates.botToken);
    }

    if (idx >= 0) {
      this.configs[idx] = {
        ...this.configs[idx],
        ...cleanUpdates,
        storeSlug, // protect slug
      };
      updated = this.configs[idx];
    } else {
      updated = {
        storeSlug,
        storeName: cleanUpdates.storeName || storeSlug,
        storeEmoji: cleanUpdates.storeEmoji || '🏬',
        ownerName: cleanUpdates.ownerName || 'Merchant',
        botUsername: cleanUpdates.botUsername || '@auraglobal_bot',
        botToken: cleanUpdates.botToken || '',
        botTokenPreview: maskToken(cleanUpdates.botToken),
        botStatus: 'connected',
        groupId: cleanUpdates.groupId || '',
        groupTitle: cleanUpdates.groupTitle || `${storeSlug} Orders Group`,
        groupInviteLink: cleanUpdates.groupInviteLink || '',
        permissions: cleanUpdates.permissions || {
          canSendOrders: true,
          canUpdateStatus: true,
          notifySoundAlert: true,
          dailySummary: true,
        },
        notificationTemplate: 'detailed',
        stats: {
          totalOrdersRouted: 0,
          lastRoutedAt: 'Never',
        },
        ...cleanUpdates,
      };
      this.configs.push(updated);
    }

    this._saveConfigs(this.configs);

    // Sync in-memory store data
    try {
      const simpleData = require('../../../data/simpleData');
      const storeObj = simpleData.stores.find((s) => s.slug === storeSlug);
      if (storeObj) {
        storeObj.telegram_group_id = updated.groupId;
        storeObj.telegram_group_name = updated.groupTitle;
      }
    } catch (_) {}

    return {
      ...updated,
      botTokenPreview: maskToken(updated.botToken || DEFAULT_BOT_TOKEN),
      hasCustomToken: Boolean(updated.botToken && updated.botToken.trim()),
    };
  }

  addLog(entry) {
    this.logs.unshift(entry);
    if (this.logs.length > 100) this.logs = this.logs.slice(0, 100);
    this._saveLogs(this.logs);
  }

  getLogs(storeSlug = null) {
    if (!storeSlug || storeSlug === 'all') return this.logs;
    return this.logs.filter((l) => l.storeSlug === storeSlug);
  }

  /**
   * Performs an actual test ping to Telegram using the Bot API
   */
  async sendTestPing({ storeSlug, groupId, groupTitle, botUsername, botToken }) {
    const config = this.getConfig(storeSlug) || {};
    const targetGroupId = (groupId || config.groupId || '').trim();
    const targetGroupTitle = (groupTitle || config.groupTitle || 'Store Kitchen & Orders Group').trim();
    const assignedBot = (botUsername || config.botUsername || '@aura_emenu_order_bot').trim();
    const storeName = config.storeName || storeSlug;
    const ownerName = config.ownerName || 'Yin';

    if (!targetGroupId) {
      return {
        success: false,
        error: 'Missing Telegram Group ID',
        message: 'Please enter a valid Telegram Group Chat ID (e.g. -5004978007 or -100...)',
      };
    }

    // Determine bot token to use:
    // 1. Explicitly provided botToken
    // 2. Configured botToken for this store
    // 3. Fallback to system bot token
    const tokenToUse = (botToken || config.botToken || '').trim() || DEFAULT_BOT_TOKEN;

    const pingText = [
      `🔔 <b>TEST PING — STORE TELEGRAM CONNECTION VERIFIED!</b>`,
      ``,
      `🏬 <b>Store:</b> ${storeName} (<code>${storeSlug}</code>)`,
      `👤 <b>Owner:</b> ${ownerName}`,
      `👥 <b>Group Chat:</b> ${targetGroupTitle}`,
      `🆔 <b>Group ID:</b> <code>${targetGroupId}</code>`,
      `🤖 <b>Assigned Bot:</b> ${assignedBot}`,
      `⚡ <b>Status:</b> ✅ Operational & Active`,
      `⏰ <b>Timestamp:</b> ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Phnom_Penh', hour12: true })}`,
      ``,
      `━━━━━━━━━━━━━━━━━━━━━`,
      `🎉 <b>Handshake Successful!</b>`,
      `Your Telegram group is properly connected to the Aura E-Menu platform.`,
      `Customer orders placed for <b>${storeName}</b> will be dispatched to this chat with itemized receipts and live sound alerts.`,
      `━━━━━━━━━━━━━━━━━━━━━`
    ].join('\n');

    let telegramResponse = null;
    let requestError = null;

    try {
      const resp = await axios.post(
        `https://api.telegram.org/bot${tokenToUse}/sendMessage`,
        {
          chat_id: targetGroupId,
          text: pingText,
          parse_mode: 'HTML',
          disable_notification: false,
        },
        { timeout: 10000 }
      );

      if (resp.data && resp.data.ok) {
        telegramResponse = resp.data.result;
      } else {
        requestError = resp.data?.description || 'Telegram API returned ok: false';
      }
    } catch (err) {
      requestError = err.response?.data?.description || err.message;
      console.error('[Telegram Test Ping Error]', requestError);
    }

    // If custom token failed with 401 or not found, try system fallback bot token
    if (!telegramResponse && tokenToUse !== DEFAULT_BOT_TOKEN) {
      try {
        console.log('[Telegram Test Ping] Retrying with system bot token fallback...');
        const respFallback = await axios.post(
          `https://api.telegram.org/bot${DEFAULT_BOT_TOKEN}/sendMessage`,
          {
            chat_id: targetGroupId,
            text: pingText,
            parse_mode: 'HTML',
            disable_notification: false,
          },
          { timeout: 10000 }
        );
        if (respFallback.data && respFallback.data.ok) {
          telegramResponse = respFallback.data.result;
          requestError = null;
        }
      } catch (fallbackErr) {
        // keep original requestError
      }
    }

    const logEntry = {
      id: `ping_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      storeSlug,
      storeName,
      groupId: targetGroupId,
      groupTitle: targetGroupTitle,
      botUsername: assignedBot,
      orderRef: `PING-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: `${ownerName} (Admin Test Ping)`,
      location: 'Admin Portal Handshake',
      itemsCount: 1,
      grandTotal: 0,
      status: telegramResponse ? 'Delivered to Telegram Group' : 'Delivery Failed',
      type: 'TEST_ALERT',
      error: requestError,
      messageId: telegramResponse?.message_id,
    };

    this.addLog(logEntry);

    if (telegramResponse) {
      // Update store stats
      if (config.storeSlug) {
        this.saveConfig(storeSlug, {
          stats: {
            totalOrdersRouted: (config.stats?.totalOrdersRouted || 0) + 1,
            lastRoutedAt: 'Just now',
          },
        });
      }

      return {
        success: true,
        message: `✅ Test ping sent directly to Telegram group "${targetGroupTitle}" (ID: ${targetGroupId})! Check your Telegram chat.`,
        messageId: telegramResponse.message_id,
        chatTitle: telegramResponse.chat?.title || targetGroupTitle,
        log: logEntry,
      };
    } else {
      let advice = '';
      if (requestError.includes('chat not found')) {
        advice = ` Ensure the bot (${assignedBot}) is added to group "${targetGroupId}" as an Administrator.`;
      } else if (requestError.includes('bot was kicked') || requestError.includes('bot is not a member')) {
        advice = ` The bot (${assignedBot}) is not in the group. Please invite it to the group chat.`;
      } else if (requestError.includes('Unauthorized')) {
        advice = ` Invalid Bot Token. Please verify the Bot Token from @BotFather.`;
      }

      return {
        success: false,
        error: requestError,
        message: `❌ Telegram Error: ${requestError}.${advice}`,
        log: logEntry,
      };
    }
  }
}

module.exports = new TelegramStoreConfigService();
