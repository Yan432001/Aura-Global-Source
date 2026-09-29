import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Button,
  Card,
  Col,
  Modal,
  QRCode,
  Row,
  Tag,
  message,
} from 'antd';
import {
  CheckCircleFilled,
  CloseOutlined,
  CopyOutlined,
  SendOutlined,
  StarFilled,
} from '@ant-design/icons';
import { formatCurrency } from '../../../utils/webTheme';

// Telegram staff & kitchen dispatch channels per shop
export const shopTelegramGroups = {
  'seller-1': '☕ Apex Warehouse Staff Group',
  'seller-2': '📦 Vector Packaging Dispatch Group',
  'seller-3': '🛡️ ShieldWorks Compliance Group',
  'seller-4': '🏢 Prime Facility Service Group',
  'seller-5': '📑 Northstar Office Orders Group',
  'seller-6': '⚡ Gridline Components Tech Group',
  'sbc-store': '☕ Aura Specialty Coffee Bar Group',
  'aura-bakery': '🥐 Aura Artisan Bakery Kitchen Group',
  'aura-bistro': '🥗 Aura Bistro Kitchen Orders Group',
  'aura-tech': '⚡ Aura Tech Store Fulfillment Group',
};

// Registered Bot identity
export const BOTFATHER_CONFIG = {
  botUsername: 'aura_emenu_order_bot',
  botName: 'Aura Multi-Store E-Menu',
  botToken: '8613686625:AAFe8-04LvQumEXZ8-MBjbNSDozba3E1lCw',
  webAppName: 'menu',
  registeredVia: '@BotFather',
  command: '/start',
};

/**
 * TelegramMiniAppModal
 * Direct Telegram launching modal with scannable QR code and deep-link launcher.
 */
export default function TelegramMiniAppModal({
  open,
  onClose,
  shop,
  product,
}) {
  const navigate = useNavigate();

  // Derive target shop if only product is provided
  const targetShop = useMemo(() => {
    if (shop) return shop;
    if (product) {
      return {
        id: product.shopId || 'seller-1',
        slug: product.shopSlug || 'sbc-store',
        name: product.shopName || 'Apex Warehouse Systems',
        rating: 4.9,
        branch: 'bangkok-hub',
        heroImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=800&fit=crop',
        logoText: 'AS',
      };
    }
    return {
      id: 'seller-1',
      slug: 'sbc-store',
      name: 'Aura Global Shop',
      rating: 4.9,
      branch: 'bangkok-hub',
      heroImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=800&fit=crop',
      logoText: 'AS',
    };
  }, [shop, product]);

  // Construct Telegram deep-link start parameter
  const startParam = useMemo(() => {
    if (product) {
      return `item_${product.id}`;
    }
    if (targetShop) {
      const slug = targetShop.slug || targetShop.id || 'sbc-store';
      return `shop_${slug}`;
    }
    return 'shop_sbc-store';
  }, [product, targetShop]);

  const directBotLink = `https://t.me/${BOTFATHER_CONFIG.botUsername}?startapp=${startParam}`;
  const targetGroup = shopTelegramGroups[targetShop?.slug] || shopTelegramGroups[targetShop?.id] || 'Kitchen Dispatch Staff Group';

  const handleLaunchTelegram = () => {
    // Launch direct bot link for universal compatibility
    window.open(directBotLink, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(directBotLink);
    message.success('Telegram direct bot link copied!');
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      closable={false}
      closeIcon={null}
      footer={null}
      width={560}
      centered
      styles={{
        content: {
          padding: 0,
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: '0 30px 90px rgba(0,0,0,0.3)',
          border: '1px solid rgba(36, 129, 204, 0.25)',
        },
      }}
    >
      {/* Top Telegram Identity Bar */}
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
                Verified
              </Tag>
            </div>
            <div style={{ fontSize: 12, opacity: 0.9 }}>
              Telegram Mini App E-Menu • {product ? 'Item Product Link' : 'Shop Directory Link'}
            </div>
          </div>
        </div>

        <Button
          type="text"
          shape="circle"
          icon={<CloseOutlined style={{ fontSize: 14, color: '#ffffff' }} />}
          onClick={onClose}
          style={{
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.18)',
            border: 'none',
          }}
          title="Close modal"
        />
      </div>

      {/* Main Content */}
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
                  Direct orders dispatched to: <strong>{targetGroup}</strong>
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
                Launch directly inside Telegram to customize items, add to cart, and place orders with real-time status updates.
              </div>

              <Button
                type="primary"
                icon={<SendOutlined />}
                size="large"
                onClick={handleLaunchTelegram}
                style={{
                  height: 48,
                  borderRadius: 14,
                  background: '#2481cc',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: 14,
                  boxShadow: '0 10px 24px rgba(36, 129, 204, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                Open in Telegram App
              </Button>

              <Button
                icon={<CopyOutlined />}
                onClick={handleCopyLink}
                style={{
                  height: 40,
                  borderRadius: 12,
                  border: '1px solid #cbd5e1',
                  fontWeight: 600,
                  fontSize: 13,
                  color: '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                Copy Telegram Link
              </Button>
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
                value={directBotLink}
                size={140}
                bordered={false}
                icon="https://telegram.org/img/t_logo.png"
                iconSize={28}
              />
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginTop: 8 }}>
                Scan with Phone / Telegram
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Modal>
  );
}
