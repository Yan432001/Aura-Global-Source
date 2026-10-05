import React, { useState, useEffect } from 'react';
import {
  Modal,
  Tabs,
  Input,
  Button,
  Switch,
  Tag,
  Badge,
  Space,
  Typography,
  message,
  Card,
  Row,
  Col,
  Alert,
  Tooltip,
} from 'antd';
import {
  ShopOutlined,
  CheckOutlined,
  SendOutlined,
  SettingOutlined,
  BellOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  LinkOutlined,
  CopyOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
  ThunderboltFilled,
  RightOutlined,
} from '@ant-design/icons';
import {
  getAllStoreTelegramConfigs,
  getStoreTelegramConfig,
  saveStoreTelegramConfig,
  sendTestGroupNotification,
  getTelegramRoutingLogs,
} from '../../data/telegramStoreGroupManager';

const { Title, Text, Paragraph } = Typography;

export default function TelegramStoreGroupModal({
  open,
  onClose,
  currentStoreSlug,
  onSwitchStore,
  triggerHaptic,
}) {
  const [activeTab, setActiveTab] = useState('stores');
  const [configs, setConfigs] = useState(getAllStoreTelegramConfigs);
  const [selectedSlugForEdit, setSelectedSlugForEdit] = useState(currentStoreSlug || 'sbc-store');

  // Form states for the currently selected store
  const [groupTitle, setGroupTitle] = useState('');
  const [groupId, setGroupId] = useState('');
  const [botUsername, setBotUsername] = useState('@auraglobal_bot');
  const [inviteLink, setInviteLink] = useState('');
  const [canSendOrders, setCanSendOrders] = useState(true);
  const [canUpdateStatus, setCanUpdateStatus] = useState(true);
  const [notifySoundAlert, setNotifySoundAlert] = useState(true);
  const [dailySummary, setDailySummary] = useState(true);

  // Routing logs
  const [routingLogs, setRoutingLogs] = useState(() => getTelegramRoutingLogs(selectedSlugForEdit));
  const [isSendingTest, setIsSendingTest] = useState(false);

  // Sync state whenever selected store or open changes
  useEffect(() => {
    const activeCfg = getStoreTelegramConfig(selectedSlugForEdit);
    if (activeCfg) {
      setGroupTitle(activeCfg.groupTitle || '');
      setGroupId(activeCfg.groupId || '');
      setBotUsername(activeCfg.botUsername || '@auraglobal_bot');
      setInviteLink(activeCfg.groupInviteLink || '');
      setCanSendOrders(activeCfg.permissions?.canSendOrders !== false);
      setCanUpdateStatus(activeCfg.permissions?.canUpdateStatus !== false);
      setNotifySoundAlert(activeCfg.permissions?.notifySoundAlert !== false);
      setDailySummary(activeCfg.permissions?.dailySummary !== false);
    }
    setRoutingLogs(getTelegramRoutingLogs(selectedSlugForEdit));
  }, [selectedSlugForEdit, open]);

  // Listen to external updates
  useEffect(() => {
    const handleUpdate = () => {
      setConfigs(getAllStoreTelegramConfigs());
      setRoutingLogs(getTelegramRoutingLogs(selectedSlugForEdit));
    };
    window.addEventListener('aura_telegram_groups_updated', handleUpdate);
    return () => window.removeEventListener('aura_telegram_groups_updated', handleUpdate);
  }, [selectedSlugForEdit]);

  // Handle Save
  const handleSaveConfig = () => {
    if (!groupId.trim()) {
      message.error('Please enter a valid Telegram Group ID (e.g. -1002345678901)');
      return;
    }
    triggerHaptic?.('success');

    saveStoreTelegramConfig(selectedSlugForEdit, {
      groupTitle: groupTitle.trim(),
      groupId: groupId.trim(),
      botUsername: botUsername.trim(),
      groupInviteLink: inviteLink.trim(),
      botStatus: 'connected',
      permissions: {
        canSendOrders,
        canUpdateStatus,
        notifySoundAlert,
        dailySummary,
      },
    });

    setConfigs(getAllStoreTelegramConfigs());
    message.success(`Telegram Group & Bot settings saved for store!`);
  };

  // Handle Send Test Notification
  const handleSendTest = () => {
    setIsSendingTest(true);
    triggerHaptic?.('medium');

    setTimeout(() => {
      const res = sendTestGroupNotification(selectedSlugForEdit);
      setIsSendingTest(false);
      triggerHaptic?.('success');
      message.success(res.message);
      setRoutingLogs(getTelegramRoutingLogs(selectedSlugForEdit));
    }, 600);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={520}
      centered
      destroyOnHidden
      className="telegram-store-group-modal"
      styles={{
        content: {
          padding: 0,
          borderRadius: 24,
          overflow: 'hidden',
          background: '#ffffff',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#2F6FED] via-[#3B82F6] to-[#1D4ED8] p-5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-xl shadow-inner border border-white/20">
              ✈️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold m-0 text-white leading-tight">
                  Telegram Store &amp; Group Manager
                </h2>
                <Tag color="cyan" style={{ borderRadius: 12, margin: 0, fontSize: 10, fontWeight: 700 }}>
                  Yin&apos;s Multi-Store
                </Tag>
              </div>
              <p className="text-xs text-blue-100/90 m-0 mt-0.5 font-medium">
                Switch store accounts &amp; link dedicated Telegram group chats
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs cursor-pointer border border-white/20 transition"
          >
            ✕
          </button>
        </div>

        {/* Tab Toggle Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-4 p-1 bg-black/15 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => {
              triggerHaptic?.('light');
              setActiveTab('stores');
            }}
            className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'stores'
                ? 'bg-white text-[#2F6FED] shadow-md'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <ShopOutlined />
            <span>Switch Store ({configs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic?.('light');
              setActiveTab('groups');
            }}
            className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'groups'
                ? 'bg-white text-[#2F6FED] shadow-md'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <SettingOutlined />
            <span>Group Chat &amp; Bot Setup</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Multi-Store Switching */}
      {activeTab === 'stores' && (
        <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
              Select Active Store Account:
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              Logged in as: <b className="text-slate-800">Yin</b>
            </span>
          </div>

          <div className="space-y-2.5">
            {configs.map((store) => {
              const isCurrent = store.storeSlug === currentStoreSlug;
              return (
                <div
                  key={store.storeSlug}
                  onClick={() => {
                    triggerHaptic?.('light');
                    onSwitchStore(store.storeSlug);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isCurrent
                      ? 'bg-blue-50/90 border-[#2F6FED] shadow-sm ring-2 ring-[#2F6FED]/20'
                      : 'bg-white border-slate-200/90 hover:border-blue-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-xl shrink-0 border border-slate-200/60 shadow-xs">
                      {store.storeEmoji || '🏬'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900 leading-tight">
                          {store.storeName}
                        </span>
                        {isCurrent && (
                          <Tag color="blue" style={{ fontSize: 10, borderRadius: 8, margin: 0, fontWeight: 700 }}>
                            ACTIVE
                          </Tag>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                        <span className="font-mono text-blue-600">/{store.storeSlug}</span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                          <CheckCircleOutlined style={{ fontSize: 10 }} />
                          {store.groupTitle ? store.groupTitle.slice(0, 22) + '...' : 'Group Configured'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSlugForEdit(store.storeSlug);
                        setActiveTab('groups');
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-[#2F6FED] text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                      title="Configure Telegram Group"
                    >
                      <SettingOutlined />
                      <span>Config</span>
                    </button>

                    {isCurrent ? (
                      <div className="w-6 h-6 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-xs font-bold">
                        <CheckOutlined />
                      </div>
                    ) : (
                      <RightOutlined className="text-slate-400 text-xs" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <Alert
            type="info"
            showIcon
            message="Independent Telegram Routing"
            description="When Yin switches to a store, incoming orders for that store are sent directly to its linked Telegram kitchen group chat."
            style={{ borderRadius: 14, fontSize: 12 }}
          />
        </div>
      )}

      {/* Tab 2: Group Controls & Bot Permissions */}
      {activeTab === 'groups' && (
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Store Switcher within setup */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Configure Settings For Store:
            </label>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {configs.map((s) => (
                <button
                  key={s.storeSlug}
                  type="button"
                  onClick={() => setSelectedSlugForEdit(s.storeSlug)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition ${
                    selectedSlugForEdit === s.storeSlug
                      ? 'bg-[#2F6FED] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span className="mr-1">{s.storeEmoji}</span>
                  {s.storeName}
                </button>
              ))}
            </div>
          </div>

          {/* Group Chat Configuration */}
          <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <span>💬 Dedicated Telegram Chat Group</span>
              </span>
              <Tag color="green" style={{ borderRadius: 8, margin: 0, fontSize: 10, fontWeight: 700 }}>
                Linked Group
              </Tag>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Group Chat Title:
              </label>
              <Input
                value={groupTitle}
                onChange={(e) => setGroupTitle(e.target.value)}
                placeholder="e.g. Aura Coffee - Kitchen & Baristas"
                style={{ borderRadius: 10 }}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-600">
                  Unique Telegram Group ID (Chat ID):
                </label>
                <span className="text-[10px] text-blue-600 font-mono font-semibold">
                  Starts with -100
                </span>
              </div>
              <Input
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                placeholder="-1002489102938"
                style={{ borderRadius: 10, fontFamily: 'monospace' }}
              />
              <p className="text-[10.5px] text-slate-500 m-0 mt-1">
                💡 <b>How to get Group ID:</b> Add <code>@auraglobal_bot</code> to your group and type <code>/getid</code> or <code>/id</code>.
              </p>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Group Invite Link (Optional):
              </label>
              <Input
                value={inviteLink}
                onChange={(e) => setInviteLink(e.target.value)}
                placeholder="https://t.me/+AbCdEfGhIjK"
                style={{ borderRadius: 10 }}
              />
            </div>
          </div>

          {/* Bot Permissions & Integration */}
          <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <span>🤖 Telegram Bot Integration &amp; Permissions</span>
              </span>
              <a
                href={`https://t.me/${botUsername.replace('@', '')}?startgroup=true`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-[#2F6FED] hover:underline flex items-center gap-1"
              >
                <span>Add Bot to Group</span>
                <LinkOutlined />
              </a>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Assigned Bot Username:
                </label>
                <Input
                  value={botUsername}
                  onChange={(e) => setBotUsername(e.target.value)}
                  placeholder="@auraglobal_bot"
                  style={{ borderRadius: 10 }}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Connection Status:
                </label>
                <div className="h-[32px] px-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-800">Bot Authorized</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-1 border-t border-slate-200/80">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-800">Route New Orders to Group</div>
                  <div className="text-[10.5px] text-slate-500">Instant kitchen tickets with items &amp; table</div>
                </div>
                <Switch checked={canSendOrders} onChange={setCanSendOrders} size="small" />
              </div>

              <div className="flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-800">Order Status Broadcasts</div>
                  <div className="text-[10.5px] text-slate-500">Alert group when order status changes to Ready</div>
                </div>
                <Switch checked={canUpdateStatus} onChange={setCanUpdateStatus} size="small" />
              </div>

              <div className="flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-800">Sound &amp; Push Alert on Ticket</div>
                  <div className="text-[10.5px] text-slate-500">Audio ping to alert staff on incoming orders</div>
                </div>
                <Switch checked={notifySoundAlert} onChange={setNotifySoundAlert} size="small" />
              </div>
            </div>
          </div>

          {/* Test & Save Actions */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button
              icon={<BellOutlined />}
              onClick={handleSendTest}
              loading={isSendingTest}
              style={{
                height: 40,
                borderRadius: 12,
                fontWeight: 600,
                borderColor: '#cbd5e1',
              }}
            >
              Send Test Alert
            </Button>

            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={handleSaveConfig}
              style={{
                height: 40,
                borderRadius: 12,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #2F6FED, #1D4ED8)',
                border: 'none',
              }}
            >
              Save Settings
            </Button>
          </div>

          {/* Recent Routing Terminal / Activity */}
          <div className="p-3 bg-slate-900 text-slate-100 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-800">
              <span className="font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Telegram Order Routing Log:
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Group: {groupId || 'Not Set'}
              </span>
            </div>

            {routingLogs.length === 0 ? (
              <p className="text-[11px] text-slate-400 font-mono m-0 py-1">
                No orders routed yet for this store. Click &quot;Send Test Alert&quot; to test routing.
              </p>
            ) : (
              <div className="space-y-1.5 max-h-28 overflow-y-auto scrollbar-none font-mono text-[11px]">
                {routingLogs.slice(0, 3).map((log) => (
                  <div key={log.id} className="p-1.5 rounded bg-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-emerald-400 font-bold">[{log.orderRef}]</span>{' '}
                      <span className="text-white">{log.itemsCount} items</span> &bull;{' '}
                      <span className="text-amber-300">${Number(log.grandTotal).toFixed(2)}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
