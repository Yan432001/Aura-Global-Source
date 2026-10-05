import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Space, Tag, Button, Avatar, Divider, Flex, message, Switch, Tooltip, Badge, Spin } from 'antd';
import { Typography } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  SafetyCertificateOutlined,
  GiftOutlined,
  ShopOutlined,
  SendOutlined,
  CheckCircleFilled,
  ThunderboltOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleIcon, TelegramIcon } from '../../components/common/SocialAuthModal';
import OrderReceiptModal from '../../components/common/OrderReceiptModal';
import { formatCurrency } from '../../utils/uiTheme';

const { Title, Paragraph, Text } = Typography;

const statusColor = {
  Pending: 'gold',
  Confirmed: 'blue',
  Preparing: 'cyan',
  Ready: 'purple',
  Completed: 'green',
  Cancelled: 'red',
};

const SYNC_STORAGE_KEY = 'aura_order_background_sync';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Background Sync & Battery Saver State
  const [backgroundSyncEnabled, setBackgroundSyncEnabled] = useState(() => {
    try {
      const stored = localStorage.getItem(SYNC_STORAGE_KEY);
      return stored !== 'false'; // defaults to true
    } catch {
      return true;
    }
  });

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());
  const [syncSecondsAgo, setSyncSecondsAgo] = useState(0);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);

  // Live timer for "Synced X seconds ago"
  useEffect(() => {
    const timer = setInterval(() => {
      setSyncSecondsAgo(Math.floor((Date.now() - lastSyncTime.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [lastSyncTime]);

  // Fetch orders
  const fetchUserOrders = async (isSilent = false) => {
    if (!isSilent) setLoadingOrders(true);
    try {
      const res = await axios.get('/api/tma/orders');
      if (res.data?.status) {
        const allOrders = res.data.orders || res.data.data || [];
        setOrders(allOrders);
        setLastSyncTime(new Date());
        setSyncSecondsAgo(0);
      }
    } catch (err) {
      if (!isSilent) {
        console.warn('Orders fetch error:', err.message);
      }
    } finally {
      if (!isSilent) setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  // Automatic real-time background sync polling if enabled by user
  useEffect(() => {
    if (!backgroundSyncEnabled) return;

    const interval = setInterval(() => {
      fetchUserOrders(true);
    }, 6000);

    return () => clearInterval(interval);
  }, [backgroundSyncEnabled]);

  // Listen for sync preference changes from other tabs or components
  useEffect(() => {
    const handleSyncChange = () => {
      try {
        const stored = localStorage.getItem(SYNC_STORAGE_KEY) !== 'false';
        setBackgroundSyncEnabled(stored);
      } catch {}
    };
    window.addEventListener('aura-sync-pref-changed', handleSyncChange);
    return () => window.removeEventListener('aura-sync-pref-changed', handleSyncChange);
  }, []);

  // Handle User Toggle
  const handleToggleSync = (checked) => {
    setBackgroundSyncEnabled(checked);
    try {
      localStorage.setItem(SYNC_STORAGE_KEY, checked ? 'true' : 'false');
      window.dispatchEvent(new Event('aura-sync-pref-changed'));
    } catch {}

    if (checked) {
      message.success('⚡ Real-time order background sync ENABLED. Live updates active.');
      fetchUserOrders(true);
    } else {
      message.warning('🔋 Battery Saver Mode ACTIVATED. Background order syncing paused to conserve battery.');
    }
  };

  const handleLogout = () => {
    logout();
    message.info('You have been signed out.');
    navigate('/login');
  };

  const displayName = user?.name || 'Aura Member';
  const displayEmail = user?.email || 'member@auraglobal.com';
  const isGoogle = user?.provider === 'google' || user?.googleVerified;
  const isTelegram = user?.provider === 'telegram' || user?.telegramVerified;
  const loyaltyPoints = user?.loyaltyPoints || 150;
  const memberTier = user?.tier || 'Gold VIP Member';

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '16px 20px 48px' }}>
      {/* Profile Header */}
      <div
        style={{
          background: isTelegram
            ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
            : isGoogle
            ? 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)'
            : 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
          padding: '40px 32px',
          textAlign: 'center',
          borderRadius: 24,
          color: 'white',
          marginBottom: 32,
          boxShadow: '0 20px 35px -10px rgba(37, 99, 235, 0.25)',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', top: 20, right: 20 }}>
          <Button
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ borderRadius: 10, background: 'rgba(255,255,255,0.9)', color: '#dc2626', fontWeight: 600, border: 'none' }}
          >
            Sign Out
          </Button>
        </div>

        <Avatar
          size={100}
          src={user?.avatar}
          icon={<UserOutlined />}
          style={{
            background: '#FFFFFF',
            marginBottom: 16,
            border: '4px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          }}
        />

        <Flex justify="center" align="center" gap={8} style={{ marginBottom: 4 }}>
          <Title level={2} style={{ fontSize: '28px', margin: 0, color: 'white', fontWeight: 800 }}>
            {displayName}
          </Title>
          {isGoogle && (
            <Tag color="#ffffff" style={{ color: '#1d4ed8', fontWeight: 700, borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 4, margin: 0 }}>
              <GoogleIcon size={14} /> Google Verified
            </Tag>
          )}
          {isTelegram && (
            <Tag color="#ffffff" style={{ color: '#0284c7', fontWeight: 700, borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 4, margin: 0 }}>
              <TelegramIcon size={14} /> Telegram Connected
            </Tag>
          )}
        </Flex>

        <Paragraph style={{ fontSize: '14px', margin: '0 0 12px', color: 'rgba(255,255,255,0.85)' }}>
          {displayEmail} {user?.username && `• ${user.username}`} &bull; {memberTier}
        </Paragraph>

        <div style={{ display: 'inline-flex', gap: 8, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '6px 16px' }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>🎁 {loyaltyPoints} Rewards Points Available</span>
        </div>
      </div>

      {/* Stats Overview */}
      <Row gutter={[20, 20]} style={{ marginBottom: 28 }}>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 18, textAlign: 'center', border: '1px solid #e2e8f0' }} styles={{ body: { padding: 18 } }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#2563eb' }}>{loyaltyPoints}</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>Aura Points</div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 18, textAlign: 'center', border: '1px solid #e2e8f0' }} styles={{ body: { padding: 18 } }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#16a34a' }}>{orders.length || 5}</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>Tracked Orders</div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 18, textAlign: 'center', border: '1px solid #e2e8f0' }} styles={{ body: { padding: 18 } }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#d97706' }}>VIP</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>Membership Tier</div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 18, textAlign: 'center', border: '1px solid #e2e8f0' }} styles={{ body: { padding: 18 } }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#7c3aed' }}>15%</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>Store Discount</div>
          </Card>
        </Col>
      </Row>

      {/* ========================================================================= */}
      {/* USER-CONTROLLED BACKGROUND ORDER SYNC & BATTERY SAVER TOGGLE               */}
      {/* ========================================================================= */}
      <Card
        style={{
          borderRadius: 20,
          border: backgroundSyncEnabled ? '1.5px solid #86efac' : '1.5px solid #fde047',
          background: backgroundSyncEnabled
            ? 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)'
            : 'linear-gradient(180deg, #fefce8 0%, #ffffff 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          marginBottom: 32,
        }}
        styles={{ body: { padding: '24px' } }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 18 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  background: backgroundSyncEnabled ? '#dcfce7' : '#fef9c3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ThunderboltOutlined style={{ fontSize: 20, color: backgroundSyncEnabled ? '#16a34a' : '#ca8a04' }} />
              </div>
              <div>
                <Title level={4} style={{ margin: 0, fontWeight: 800, color: '#0f172a' }}>
                  Real-Time Order Background Sync
                </Title>
                <Text style={{ fontSize: 12.5, color: '#64748b' }}>
                  Device power management &amp; live order tracking preference
                </Text>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {backgroundSyncEnabled ? (
              <Tag color="success" style={{ fontWeight: 700, borderRadius: 8, padding: '4px 10px', fontSize: 12 }}>
                🟢 Real-Time Sync Active (Every 6s)
              </Tag>
            ) : (
              <Tag color="gold" style={{ fontWeight: 700, borderRadius: 8, padding: '4px 10px', fontSize: 12 }}>
                🔋 Battery Saver Mode Active
              </Tag>
            )}

            <Switch
              checked={backgroundSyncEnabled}
              onChange={handleToggleSync}
              checkedChildren={<span style={{ fontWeight: 800 }}>ON</span>}
              unCheckedChildren={<span style={{ fontWeight: 800 }}>OFF</span>}
              style={{
                background: backgroundSyncEnabled ? '#16a34a' : '#cbd5e1',
                transform: 'scale(1.15)',
              }}
            />
          </div>
        </div>

        <Paragraph style={{ color: '#475569', fontSize: 13.5, lineHeight: 1.6, marginBottom: 18 }}>
          {backgroundSyncEnabled ? (
            <span>
              ⚡ <b>Active Background Syncing is ON:</b> Aura checks order progression every few seconds in the background and delivers audio chimes and status alerts when your food/coffee transitions from <b>Pending</b> to <b>Preparing</b> or <b>Ready</b>.
            </span>
          ) : (
            <span>
              🔋 <b>Battery Saver Mode is ON:</b> Automatic background polling and CPU wake-locks are paused to preserve your phone or laptop battery and mobile data. You can tap <b>"Manual Sync Now"</b> whenever you want to check for updates.
            </span>
          )}
        </Paragraph>

        {/* Impact Comparison Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12}>
            <div
              style={{
                padding: '14px 16px',
                borderRadius: 14,
                background: '#ffffff',
                border: backgroundSyncEnabled ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div style={{ fontSize: 24 }}>🔋</div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', display: 'block' }}>
                  Battery &amp; Hardware Impact
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: backgroundSyncEnabled ? '#166534' : '#15803d' }}>
                  {backgroundSyncEnabled
                    ? 'Standard Mode (~2.4% / hr background wake)'
                    : 'Optimal Power Saver (0% background wake)'}
                </span>
              </div>
            </div>
          </Col>

          <Col xs={24} sm={12}>
            <div
              style={{
                padding: '14px 16px',
                borderRadius: 14,
                background: '#ffffff',
                border: backgroundSyncEnabled ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div style={{ fontSize: 24 }}>📡</div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', display: 'block' }}>
                  Live Notification Behavior
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: backgroundSyncEnabled ? '#0369a1' : '#b45309' }}>
                  {backgroundSyncEnabled
                    ? 'Instant auto-chimes & status toasts'
                    : 'On-demand sync only (Manual refresh)'}
                </span>
              </div>
            </div>
          </Col>
        </Row>

        {/* Sync Status Footer with Manual Sync Trigger */}
        <div
          style={{
            padding: '10px 16px',
            borderRadius: 12,
            background: 'rgba(255, 255, 255, 0.7)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: '#64748b' }}>
            <ClockCircleOutlined />
            <span>
              Last synced: <b>{syncSecondsAgo < 3 ? 'Just now' : `${syncSecondsAgo}s ago`}</b>
              {backgroundSyncEnabled && ' • Next auto-poll in ~6s'}
            </span>
          </div>

          <Button
            size="small"
            icon={<SyncOutlined spin={loadingOrders} />}
            onClick={() => fetchUserOrders(false)}
            loading={loadingOrders}
            style={{ borderRadius: 8, fontWeight: 700, fontSize: 12 }}
          >
            Manual Sync Now
          </Button>
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* RECENT ORDERS & LIVE STATUS TRACKING SECTION                              */}
      {/* ========================================================================= */}
      <Card
        style={{ borderRadius: 20, border: '1px solid #e2e8f0', marginBottom: 32 }}
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 800 }}>📦 My Recent Orders &amp; Live Tracking</span>
            <Button
              type="link"
              size="small"
              icon={<ShopOutlined />}
              onClick={() => navigate('/shop/sbc-store')}
              style={{ fontWeight: 700 }}
            >
              Order from Menu &rarr;
            </Button>
          </div>
        }
      >
        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 16px', color: '#94a3b8' }}>
            <FileTextOutlined style={{ fontSize: 36, marginBottom: 8, color: '#cbd5e1' }} />
            <Paragraph style={{ margin: 0, color: '#64748b', fontSize: 14 }}>
              No orders placed yet. Browse our specialty menus to make your first order!
            </Paragraph>
            <Button
              type="primary"
              style={{ marginTop: 14, borderRadius: 10, background: '#2563eb' }}
              onClick={() => navigate('/shop/sbc-store')}
            >
              Explore Specialty Store
            </Button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {orders.slice(0, 4).map((order) => {
              const orderRef = order.referenceNo || `ORD-${order.id}`;
              const orderStatus = order.status || 'Pending';
              const itemsCount = (order.items || []).reduce((sum, it) => sum + (it.quantity || 1), 0);
              const orderTotal = formatCurrency(order.grandTotal || order.total || 0);

              return (
                <div
                  key={orderRef}
                  style={{
                    padding: '14px 18px',
                    borderRadius: 14,
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 12,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 12,
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20,
                      }}
                    >
                      ☕
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 14, color: '#0f172a' }}>
                          #{orderRef}
                        </span>
                        <Tag color={statusColor[orderStatus] || 'default'} style={{ borderRadius: 6, fontWeight: 700, margin: 0 }}>
                          {orderStatus.toUpperCase()}
                        </Tag>
                      </div>
                      <span style={{ fontSize: 12, color: '#64748b' }}>
                        {order.store_name || 'Aura Specialty Store'} • {itemsCount} items • {orderTotal}
                      </span>
                    </div>
                  </div>

                  <Button
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => setSelectedReceiptOrder(order)}
                    style={{ borderRadius: 8, fontWeight: 600, fontSize: 12 }}
                  >
                    View Receipt
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Badges and Settings Row */}
      <Row gutter={[20, 20]} style={{ marginBottom: 32 }}>
        <Col xs={24} md={12}>
          <Card style={{ borderRadius: 18, border: '1px solid #e2e8f0' }} title={<div style={{ fontSize: 15, fontWeight: 700 }}>🏆 Member Privileges</div>}>
            <Space direction="vertical" style={{ width: '100%' }} size={10}>
              <div style={{ padding: '10px 14px', borderRadius: 12, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>☕ Free Artisan Pour-Over Refill</span>
                <Tag color="green">ACTIVE</Tag>
              </div>
              <div style={{ padding: '10px 14px', borderRadius: 12, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>⚡ Priority Mobile Order Fulfillment</span>
                <Tag color="blue">UNLOCKED</Tag>
              </div>
              <div style={{ padding: '10px 14px', borderRadius: 12, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>📱 Real-time Telegram Receipt &amp; Alerts</span>
                <Tag color={isTelegram ? 'cyan' : 'default'}>{isTelegram ? 'CONNECTED' : 'DISCONNECTED'}</Tag>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card style={{ borderRadius: 18, border: '1px solid #e2e8f0' }} title={<div style={{ fontSize: 15, fontWeight: 700 }}>⚙️ Account Actions</div>}>
            <Space direction="vertical" style={{ width: '100%' }} size={10}>
              <Button block style={{ borderRadius: 10, height: 42 }} onClick={() => navigate('/shop/sbc-store')}>
                Browse Storefront &amp; Order
              </Button>
              <Button block style={{ borderRadius: 10, height: 42 }} onClick={() => navigate('/admins/dashboard')}>
                Admin ERP Workspace
              </Button>
              <Button danger block style={{ borderRadius: 10, height: 42 }} onClick={handleLogout}>
                Sign Out from Aura Global
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Order Receipt Modal */}
      {selectedReceiptOrder && (
        <OrderReceiptModal
          order={selectedReceiptOrder}
          open={Boolean(selectedReceiptOrder)}
          onClose={() => setSelectedReceiptOrder(null)}
          storeInfo={{ name: selectedReceiptOrder.store_name }}
        />
      )}
    </div>
  );
}
