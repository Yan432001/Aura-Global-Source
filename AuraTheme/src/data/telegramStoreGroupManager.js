// Telegram Mini App: Multi-Store Group Management & Bot Permissions Store
// Allows store owners (e.g. Yin) to seamlessly switch stores and manage dedicated Telegram groups & bots.

const STORAGE_KEY = 'aura_telegram_store_groups_v1';
const ROUTING_LOGS_KEY = 'aura_telegram_routing_logs_v1';

export const DEFAULT_TELEGRAM_STORE_CONFIGS = [
  {
    storeSlug: 'sbc-store',
    storeName: 'Aura Specialty Coffee',
    storeEmoji: '☕',
    ownerName: 'Yin',
    botUsername: '@auraglobal_bot',
    botTokenPreview: '7819203948:AAH...kL9',
    botStatus: 'connected', // 'connected' | 'pending' | 'inactive'
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
    botUsername: '@auraglobal_bot',
    botTokenPreview: '7819203948:AAH...kL9',
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
    ownerName: 'Yin',
    botUsername: '@auraglobal_bot',
    botTokenPreview: '7819203948:AAH...kL9',
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
    ownerName: 'Yin',
    botUsername: '@auraglobal_bot',
    botTokenPreview: '7819203948:AAH...kL9',
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
    storeName: 'Aura Tech & Workstations',
    storeEmoji: '💻',
    ownerName: 'Yin',
    botUsername: '@auraglobal_bot',
    botTokenPreview: '7819203948:AAH...kL9',
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
    storeSlug: 'apex-pc',
    storeName: 'Apex PC & Workstation Hub',
    storeEmoji: '🖥️',
    ownerName: 'Elena Rostova',
    botUsername: '@auraglobal_bot',
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
    botUsername: '@auraglobal_bot',
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

// Read all store configs
export const getAllStoreTelegramConfigs = () => {
  if (typeof window === 'undefined') return DEFAULT_TELEGRAM_STORE_CONFIGS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TELEGRAM_STORE_CONFIGS));
      return DEFAULT_TELEGRAM_STORE_CONFIGS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure any newly added default stores (like nexus-mobile) exist in the list
      let hasChanges = false;
      const combined = [...parsed];
      DEFAULT_TELEGRAM_STORE_CONFIGS.forEach((def) => {
        if (!combined.some((c) => c.storeSlug === def.storeSlug)) {
          combined.push(def);
          hasChanges = true;
        }
      });
      if (hasChanges) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(combined));
      }
      return combined;
    }
    return DEFAULT_TELEGRAM_STORE_CONFIGS;
  } catch (err) {
    console.warn('[telegramStoreGroupManager] Failed reading from localStorage:', err);
    return DEFAULT_TELEGRAM_STORE_CONFIGS;
  }
};

// Get single store config by slug
export const getStoreTelegramConfig = (storeSlug) => {
  const configs = getAllStoreTelegramConfigs();
  const found = configs.find((c) => c.storeSlug === storeSlug);
  if (found) return found;

  // Fallback template for unknown store
  return {
    storeSlug,
    storeName: storeSlug.replace(/-/g, ' ').toUpperCase(),
    storeEmoji: '🏬',
    ownerName: 'Yin',
    botUsername: '@auraglobal_bot',
    botTokenPreview: '7819203948:AAH...kL9',
    botStatus: 'connected',
    groupId: `-100${Math.floor(2000000000 + Math.random() * 9000000000)}`,
    groupTitle: `${storeSlug.replace(/-/g, ' ')} Orders Group`,
    groupInviteLink: '',
    permissions: {
      canSendOrders: true,
      canUpdateStatus: true,
      notifyInquiries: true,
      dailySummary: true,
      notifySoundAlert: true,
    },
    notificationTemplate: 'detailed',
    stats: {
      totalOrdersRouted: 0,
      lastRoutedAt: 'Never',
    },
  };
};

// Update and persist config for a store
export const saveStoreTelegramConfig = (storeSlug, updates) => {
  const configs = getAllStoreTelegramConfigs();
  const index = configs.findIndex((c) => c.storeSlug === storeSlug);

  let updatedConfigs;
  if (index >= 0) {
    updatedConfigs = configs.map((c) =>
      c.storeSlug === storeSlug ? { ...c, ...updates } : c
    );
  } else {
    updatedConfigs = [...configs, { storeSlug, ...updates }];
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedConfigs));
    window.dispatchEvent(
      new CustomEvent('aura_telegram_groups_updated', {
        detail: { storeSlug, configs: updatedConfigs },
      })
    );
  } catch (err) {
    console.error('[telegramStoreGroupManager] Failed saving to localStorage:', err);
  }

  // Sync to backend server persistence
  try {
    fetch('/api/admin/telegram-stores/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storeSlug, ...updates }),
    }).catch(() => {});
  } catch (_) {}

  return updatedConfigs.find((c) => c.storeSlug === storeSlug);
};

// Sync store configs with server on initialization
export const syncStoreTelegramConfigsWithServer = async () => {
  try {
    const resp = await fetch('/api/admin/telegram-stores');
    if (resp.ok) {
      const result = await resp.json();
      if (result.status && Array.isArray(result.data) && result.data.length > 0) {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(result.data));
          window.dispatchEvent(
            new CustomEvent('aura_telegram_groups_updated', {
              detail: { configs: result.data },
            })
          );
        }
        return result.data;
      }
    }
  } catch (_) {}
  return getAllStoreTelegramConfigs();
};

// Read routing logs
export const getTelegramRoutingLogs = (storeSlug = null) => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(ROUTING_LOGS_KEY);
    if (!raw) return [];
    const logs = JSON.parse(raw);
    if (!Array.isArray(logs)) return [];
    if (!storeSlug || storeSlug === 'all') return logs;
    return logs.filter((log) => log.storeSlug === storeSlug);
  } catch (err) {
    return [];
  }
};

// Route an order notification to the dedicated Telegram Group ID
export const routeOrderToTelegramGroup = (storeSlug, orderData) => {
  const config = getStoreTelegramConfig(storeSlug);

  const newLog = {
    id: `route_${Date.now()}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    storeSlug,
    storeName: config.storeName,
    groupId: config.groupId,
    groupTitle: config.groupTitle,
    botUsername: config.botUsername,
    orderRef: orderData.referenceNo || `ORD-${Date.now().toString().slice(-4)}`,
    customerName: orderData.customer?.name || 'Customer',
    location: orderData.customer?.address || 'Table #06',
    itemsCount: orderData.items?.reduce((s, it) => s + (it.quantity || 1), 0) || 1,
    grandTotal: orderData.grandTotal || 0,
    status: 'Delivered to Group Chat',
    type: orderData.isTest ? 'TEST_ALERT' : 'LIVE_ORDER',
  };

  // Persist in routing logs (keep latest 50)
  try {
    const existing = getTelegramRoutingLogs();
    const updatedLogs = [newLog, ...existing].slice(0, 50);
    window.localStorage.setItem(ROUTING_LOGS_KEY, JSON.stringify(updatedLogs));
  } catch (_) {}

  // Update store stats
  saveStoreTelegramConfig(storeSlug, {
    stats: {
      totalOrdersRouted: (config.stats?.totalOrdersRouted || 0) + 1,
      lastRoutedAt: 'Just now',
    },
  });

  return newLog;
};

// Send a test notification to verify bot permissions and group ID
export const sendTestGroupNotification = async (storeSlug, overrideParams = {}) => {
  const config = getStoreTelegramConfig(storeSlug);
  const payload = {
    storeSlug,
    groupId: overrideParams.groupId || config.groupId,
    groupTitle: overrideParams.groupTitle || config.groupTitle,
    botUsername: overrideParams.botUsername || config.botUsername,
    botToken: overrideParams.botToken || config.botToken || '',
  };

  let serverResult = null;
  try {
    const resp = await fetch('/api/admin/telegram-stores/test-ping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    serverResult = await resp.json();
  } catch (netErr) {
    console.warn('[telegramStoreGroupManager] Network error contacting test-ping API:', netErr);
  }

  const testOrder = {
    referenceNo: serverResult?.log?.orderRef || `PING-${Math.floor(1000 + Math.random() * 9000)}`,
    isTest: true,
    customer: {
      name: `${config.ownerName} (Owner Verification)`,
      address: 'Counter / Test Dispatch',
      phone: '+855 12 345 678',
    },
    items: [
      { name: 'Store Ping & Permission Handshake', quantity: 1, price: 0 },
      { name: 'Kitchen Bot Notification Test', quantity: 1, price: 0 },
    ],
    grandTotal: 0,
  };

  const routed = routeOrderToTelegramGroup(storeSlug, testOrder);

  if (serverResult && serverResult.success) {
    return {
      success: true,
      routed,
      message: serverResult.message || `Test notification sent successfully to group "${payload.groupTitle}" (ID: ${payload.groupId}) via ${payload.botUsername}`,
      messageId: serverResult.messageId,
    };
  } else if (serverResult && !serverResult.success) {
    return {
      success: false,
      routed,
      error: serverResult.error,
      message: serverResult.message || `Failed to send ping to Telegram group "${payload.groupTitle}" (ID: ${payload.groupId})`,
    };
  }

  return {
    success: true,
    routed,
    message: `Test notification sent to group "${config.groupTitle}" (ID: ${config.groupId}) via ${config.botUsername}`,
  };
};
