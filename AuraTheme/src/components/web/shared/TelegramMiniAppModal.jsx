import React, { useState, useMemo } from 'react';
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Modal,
  QRCode,
  Row,
  Segmented,
  Space,
  Tag,
  Typography,
  message,
} from 'antd';
import {
  CheckCircleFilled,
  CloseOutlined,
  CopyOutlined,
  MobileOutlined,
  QrcodeOutlined,
  SendOutlined,
  ShoppingOutlined,
  StarFilled,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { formatCurrency, publicTheme } from '../../../utils/webTheme';

const { Text, Title, Paragraph } = Typography;

// Telegram staff & kitchen dispatch channels per shop
export const shopTelegramGroups = {
  'seller-1': '☕ Apex Warehouse Staff Group',
  'seller-2': '📦 Vector Packaging Dispatch Group',
  'seller-3': '🛡️ ShieldWorks Compliance Group',
  'seller-4': '🏢 Prime Facility Service Group',
  'seller-5': '📑 Northstar Office Orders Group',
  'seller-6': '⚡ Gridline Components Tech Group',
  'sbc-store': '☕ Aura Specialty Coffee Bar Group',
};

// Registered BotFather identity
export const BOTFATHER_CONFIG = {
  botUsername: 'AuraSupplyBot',
  botName: 'Aura Supply Official Bot',
  webAppName: 'menu',
  registeredVia: '@BotFather',
  command: '/menu',
};

/**
 * TelegramMiniAppModal
 * New Concept: Connect each shop and each item product directly to Telegram Mini App via @BotFather.
 * Provides direct Telegram launching, scannable QR code for mobile Telegram,
 * BotFather technical metadata, and an interactive simulated Telegram Mini App WebApp experience.
 */
export default function TelegramMiniAppModal({
  open,
  onClose,
  shop,
  product,
  allProducts = [],
}) {
  const [activeTab, setActiveTab] = useState('gateway'); // 'gateway' | 'simulator'
  const [simulatorView, setSimulatorView] = useState('catalog'); // 'catalog' | 'orders'
  const [cart, setCart] = useState([]);
  const [dispatchedOrder, setDispatchedOrder] = useState(null);

  // Derive target shop if only product is provided
  const targetShop = useMemo(() => {
    if (shop) return shop;
    if (product) {
      return {
        id: product.shopId || 'seller-1',
        name: product.shopName || 'Apex Warehouse Systems',
        rating: 4.9,
        branch: 'bangkok-hub',
        heroImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=800&fit=crop',
        logoText: 'AS',
      };
    }
    return {
      id: 'seller-1',
      name: 'Aura Global Shop',
      rating: 4.9,
      branch: 'bangkok-hub',
      heroImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=800&fit=crop',
      logoText: 'AS',
    };
  }, [shop, product]);

  // Construct official BotFather deep-link start parameter
  const startParam = useMemo(() => {
    if (product) {
      return `item_${product.id}`;
    }
    if (targetShop) {
      return `shop_${targetShop.id || targetShop.slug || 'seller-1'}`;
    }
    return 'menu';
  }, [product, targetShop]);

  const telegramWebLink = `https://t.me/${BOTFATHER_CONFIG.botUsername}/${BOTFATHER_CONFIG.webAppName}?startapp=${startParam}`;
  const telegramProtocolLink = `tg://resolve?domain=${BOTFATHER_CONFIG.botUsername}&appname=${BOTFATHER_CONFIG.webAppName}&startapp=${startParam}`;
  const targetGroup = shopTelegramGroups[targetShop?.id] || 'Kitchen Dispatch Staff Group';

  // Available catalog for simulator
  const shopCatalog = useMemo(() => {
    if (allProducts && allProducts.length > 0) {
      const filtered = allProducts.filter((p) => p.shopId === targetShop?.id);
      if (filtered.length > 0) return filtered;
    }
    if (product) return [product];
    return [];
  }, [allProducts, targetShop, product]);

  // Initialize cart with selected item if provided
  React.useEffect(() => {
    if (product && open) {
      setCart([{ ...product, quantity: 1 }]);
      setDispatchedOrder(null);
    } else if (!product && open) {
      setCart([]);
      setDispatchedOrder(null);
    }
  }, [product, open]);

  const handleLaunchTelegram = () => {
    // Try opening deep link in Telegram
    window.open(telegramWebLink, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(telegramWebLink);
    message.success('Telegram Bot link copied to clipboard!');
  };

  const handleAddToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) => (p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    message.success(`Added ${item.name} to Telegram Mini App Cart`);
  };

  const handleUpdateQuantity = (itemId, delta) => {
    setCart((prev) =>
      prev
        .map((p) => {
          if (p.id === itemId) {
            const next = p.quantity + delta;
            return next > 0 ? { ...p, quantity: next } : null;
          }
          return p;
        })
        .filter(Boolean)
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  const handleDispatchOrder = () => {
    const orderRef = `TMA-${Date.now().toString().slice(-6)}`;
    const newOrder = {
      ref: orderRef,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: [...cart],
      total: cartTotal,
      shopName: targetShop?.name,
      group: targetGroup,
    };
    setDispatchedOrder(newOrder);
    setCart([]);
    setSimulatorView('orders');
    message.success(`Order #${orderRef} dispatched to ${targetGroup}!`);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={620}
      centered
      styles={{
        content: {
          padding: 0,
          borderRadius: 28,
          overflow: 'hidden',
          boxShadow: '0 30px 90px rgba(0,0,0,0.3)',
          border: '1px solid rgba(36, 129, 204, 0.25)',
        },
      }}
    >
      {/* Top Telegram BotFather Identity Bar */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1d74b8 0%, #2481cc 60%, #3ba2e8 100%)',
          padding: '16px 20px',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2481cc',
              fontSize: 22,
              boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
            }}
          >
            ✈️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16, fontWeight: 800 }}>@{BOTFATHER_CONFIG.botUsername}</span>
              <CheckCircleFilled style={{ color: '#6ee7b7', fontSize: 14 }} />
              <Tag
                style={{
                  background: 'rgba(255,255,255,0.22)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 999,
                  fontSize: 10,
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                BotFather Verified
              </Tag>
            </div>
            <div style={{ fontSize: 12, opacity: 0.9 }}>
              Telegram Mini App E-Menu • {product ? 'Item Product Link' : 'Shop Directory Link'}
            </div>
          </div>
        </div>

        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={onClose}
          style={{ color: '#ffffff', fontSize: 16 }}
        />
      </div>

      {/* Concept Mode Switcher: Open in Telegram vs Interactive Simulator */}
      <div
        style={{
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          padding: '10px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Segmented
          value={activeTab}
          onChange={setActiveTab}
          options={[
            {
              value: 'gateway',
              label: (
                <span style={{ fontWeight: 700, fontSize: 12 }}>
                  <SendOutlined style={{ marginRight: 6, color: '#2481cc' }} />
                  Open in Telegram
                </span>
              ),
            },
            {
              value: 'simulator',
              label: (
                <span style={{ fontWeight: 700, fontSize: 12 }}>
                  <MobileOutlined style={{ marginRight: 6, color: '#2481cc' }} />
                  Telegram WebApp Simulator
                </span>
              ),
            },
          ]}
          style={{ background: '#e2e8f0', borderRadius: 999, padding: 3 }}
        />

        <div style={{ fontSize: 11, color: '#64748b' }}>
          Start Param: <code style={{ color: '#2481cc', fontWeight: 700 }}>{startParam}</code>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'gateway' ? (
        /* TAB 1: Real BotFather Telegram Link & QR Code Gateway */
        <div style={{ padding: '24px 24px 20px', background: '#ffffff' }}>
          {/* Target Item or Shop Spotlight Card */}
          {product ? (
            <Card
              style={{
                borderRadius: 20,
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                border: '1px solid #bae6fd',
                marginBottom: 20,
              }}
              styles={{ body: { padding: 14 } }}
            >
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 14,
                    objectFit: 'cover',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <Tag color="blue" style={{ borderRadius: 999, fontWeight: 700, margin: 0, fontSize: 10 }}>
                      TELEGRAM PRODUCT ITEM
                    </Tag>
                    <span style={{ fontSize: 11, color: '#64748b' }}>{targetShop?.name}</span>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                    {product.name}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#0284c7', marginTop: 4 }}>
                    {formatCurrency(product.price)}
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card
              style={{
                borderRadius: 20,
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                border: '1px solid #bae6fd',
                marginBottom: 20,
              }}
              styles={{ body: { padding: 14 } }}
            >
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <Avatar
                  size={64}
                  style={{
                    background: '#2481cc',
                    fontWeight: 800,
                    fontSize: 20,
                    boxShadow: '0 4px 12px rgba(36, 129, 204, 0.3)',
                  }}
                >
                  {targetShop?.logoText || targetShop?.name?.slice(0, 2) || 'AS'}
                </Avatar>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <Tag color="blue" style={{ borderRadius: 999, fontWeight: 700, margin: 0, fontSize: 10 }}>
                      TELEGRAM E-MENU SHOP
                    </Tag>
                    <span style={{ fontSize: 11, color: '#64748b' }}>
                      <StarFilled style={{ color: '#f59e0b' }} /> {targetShop?.rating || 4.9}
                    </span>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                    {targetShop?.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                    Auto-routing orders directly to: <strong>{targetGroup}</strong>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Primary Action & QR Code Section */}
          <Row gutter={[20, 20]} align="middle">
            <Col xs={24} sm={14}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.5 }}>
                  This product item & shop menu is connected to Telegram via <strong>@BotFather</strong>.
                  Click the button below to launch directly inside the official Telegram app.
                </div>

                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  size="large"
                  onClick={handleLaunchTelegram}
                  style={{
                    height: 50,
                    borderRadius: 16,
                    background: '#2481cc',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: 15,
                    boxShadow: '0 10px 24px rgba(36, 129, 204, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  Open in Telegram App
                </Button>

                <div style={{ display: 'flex', gap: 8 }}>
                  <Button
                    icon={<CopyOutlined />}
                    onClick={handleCopyLink}
                    style={{
                      flex: 1,
                      height: 40,
                      borderRadius: 12,
                      border: '1px solid #cbd5e1',
                      fontWeight: 600,
                      fontSize: 12,
                      color: '#475569',
                    }}
                  >
                    Copy Bot Link
                  </Button>
                  <Button
                    icon={<MobileOutlined />}
                    onClick={() => setActiveTab('simulator')}
                    style={{
                      flex: 1,
                      height: 40,
                      borderRadius: 12,
                      border: '1px solid #cbd5e1',
                      fontWeight: 600,
                      fontSize: 12,
                      color: '#475569',
                    }}
                  >
                    Test Simulator
                  </Button>
                </div>
              </div>
            </Col>

            {/* Scannable Telegram QR Code */}
            <Col xs={24} sm={10} style={{ textAlign: 'center' }}>
              <div
                style={{
                  background: '#f8fafc',
                  padding: 14,
                  borderRadius: 20,
                  border: '1px solid #e2e8f0',
                  display: 'inline-block',
                }}
              >
                <QRCode
                  value={telegramWebLink}
                  size={140}
                  bordered={false}
                  icon="https://telegram.org/img/t_logo.png"
                  iconSize={28}
                />
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginTop: 8 }}>
                  Scan with Telegram
                </div>
              </div>
            </Col>
          </Row>

          <Divider style={{ margin: '18px 0 14px' }} />

          {/* BotFather Technical Specs Footnote */}
          <div
            style={{
              background: '#f1f5f9',
              borderRadius: 14,
              padding: '10px 14px',
              fontSize: 11,
              color: '#64748b',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Bot Identity: <strong>@{BOTFATHER_CONFIG.botUsername}</strong></span>
              <span>WebApp Name: <strong>{BOTFATHER_CONFIG.webAppName}</strong></span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Registered via: <strong>{BOTFATHER_CONFIG.registeredVia}</strong></span>
              <span>Target Group: <strong>{targetGroup}</strong></span>
            </div>
          </div>
        </div>
      ) : (
        /* TAB 2: Interactive Telegram Mini App Simulator */
        <div style={{ background: '#0f172a', color: '#ffffff', minHeight: 480 }}>
          {/* Simulated Telegram App Header Bar */}
          <div
            style={{
              background: '#2481cc',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2481cc',
                  fontWeight: 900,
                  fontSize: 14,
                }}
              >
                ✈️
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, lineHeight: 1.1 }}>
                  {BOTFATHER_CONFIG.botName}
                </div>
                <div style={{ fontSize: 10, opacity: 0.85 }}>bot • Mini App</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                type="button"
                onClick={() => setSimulatorView('catalog')}
                style={{
                  padding: '4px 10px',
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: simulatorView === 'catalog' ? 'rgba(255,255,255,0.25)' : 'transparent',
                  color: '#ffffff',
                }}
              >
                Catalog
              </button>
              <button
                type="button"
                onClick={() => setSimulatorView('orders')}
                style={{
                  padding: '4px 10px',
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: simulatorView === 'orders' ? 'rgba(255,255,255,0.25)' : 'transparent',
                  color: '#ffffff',
                }}
              >
                Orders {dispatchedOrder ? '(1)' : ''}
              </button>
            </div>
          </div>

          {/* Group notice */}
          <div
            style={{
              background: '#1e293b',
              padding: '6px 14px',
              fontSize: 11,
              color: '#38bdf8',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>● Connected: {targetShop?.name}</span>
            <span style={{ opacity: 0.8 }}>{targetGroup}</span>
          </div>

          {/* Simulator Body */}
          <div style={{ padding: 16, maxHeight: 360, overflowY: 'auto' }}>
            {simulatorView === 'catalog' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Highlighted item if opened for specific product */}
                {product && (
                  <div
                    style={{
                      background: 'rgba(56, 189, 248, 0.12)',
                      borderRadius: 14,
                      border: '1px solid #38bdf8',
                      padding: 12,
                      display: 'flex',
                      gap: 12,
                      alignItems: 'center',
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: 64, height: 64, borderRadius: 10, objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 10, color: '#38bdf8', fontWeight: 800 }}>
                        ★ DEEP-LINKED ITEM (via {startParam})
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {product.name}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 900, color: '#38bdf8', marginTop: 2 }}>
                        {formatCurrency(product.price)}
                      </div>
                    </div>
                    <Button
                      size="small"
                      type="primary"
                      onClick={() => handleAddToCart(product)}
                      style={{
                        background: '#2481cc',
                        border: 'none',
                        borderRadius: 8,
                        fontWeight: 700,
                        fontSize: 11,
                      }}
                    >
                      + Add
                    </Button>
                  </div>
                )}

                {/* All items in this shop */}
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, marginTop: 4 }}>
                  SHOP ITEMS ({shopCatalog.length})
                </div>

                {shopCatalog.map((item) => {
                  const inCart = cart.find((c) => c.id === item.id);

                  return (
                    <div
                      key={item.id}
                      style={{
                        background: '#1e293b',
                        borderRadius: 12,
                        padding: 10,
                        display: 'flex',
                        gap: 12,
                        alignItems: 'center',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: '#38bdf8', marginTop: 2 }}>
                          {formatCurrency(item.price)}
                        </div>
                      </div>

                      {inCart ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.id, -1)}
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 6,
                              border: 'none',
                              background: '#334155',
                              color: '#ffffff',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            -
                          </button>
                          <span style={{ fontSize: 12, fontWeight: 700, minWidth: 16, textAlign: 'center' }}>
                            {inCart.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.id, 1)}
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 6,
                              border: 'none',
                              background: '#2481cc',
                              color: '#ffffff',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <Button
                          size="small"
                          type="primary"
                          onClick={() => handleAddToCart(item)}
                          style={{
                            background: '#2481cc',
                            border: 'none',
                            borderRadius: 8,
                            fontWeight: 700,
                            fontSize: 11,
                          }}
                        >
                          + Add
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Orders View */
              <div>
                {dispatchedOrder ? (
                  <div
                    style={{
                      background: '#1e293b',
                      borderRadius: 14,
                      padding: 14,
                      border: '1px solid #38bdf8',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 800, color: '#38bdf8' }}>
                        ORDER REF: #{dispatchedOrder.ref}
                      </span>
                      <Tag color="success" style={{ margin: 0, borderRadius: 999, fontWeight: 700, fontSize: 10 }}>
                        Sent to Staff ⚡
                      </Tag>
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8 }}>
                      Sent to: {dispatchedOrder.group}
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 8 }}>
                      {dispatchedOrder.items.map((i) => (
                        <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                          <span>{i.quantity}x {i.name}</span>
                          <span style={{ fontWeight: 700 }}>{formatCurrency(i.price * i.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 8, marginTop: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#38bdf8' }}>
                      <span>Total:</span>
                      <span>{formatCurrency(dispatchedOrder.total)}</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '30px 0', color: '#94a3b8' }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>🧾</div>
                    <div>No dispatched orders yet</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Dispatch Button in Simulator */}
          {cart.length > 0 && simulatorView === 'catalog' && (
            <div
              style={{
                background: '#1e293b',
                padding: 12,
                borderTop: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>
                  {cart.reduce((s, i) => s + i.quantity, 0)} items in cart
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#38bdf8' }}>
                  {formatCurrency(cartTotal)}
                </div>
              </div>

              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleDispatchOrder}
                style={{
                  borderRadius: 10,
                  background: '#2481cc',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: 12,
                }}
              >
                Send Order to Telegram Group
              </Button>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
