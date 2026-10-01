import React from 'react';
import { Avatar, Button, Card, Col, Modal, Row, Space, Tag, Typography } from 'antd';
import {
  SendOutlined,
  ShopOutlined,
  StarFilled,
  EnvironmentOutlined,
  ClockCircleOutlined,
  UsergroupAddOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { formatCompact, publicTheme } from '../../../utils/webTheme';
import { BOTFATHER_CONFIG } from './TelegramMiniAppModal';

const { Paragraph, Text, Title } = Typography;

const ShopQuickViewModal = ({ shop, open, onClose, onOpenTelegram, shopProducts = [] }) => {
  const navigate = useNavigate();

  if (!shop) {
    return null;
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={860}
      centered
      styles={{ body: { padding: 24 } }}
      title={null}
    >
      <Row gutter={[24, 24]}>
        {/* Left Column: Shop Banner & Visuals */}
        <Col xs={24} md={11}>
          <div style={{ position: 'relative', borderRadius: 22, overflow: 'hidden', height: 260 }}>
            <img
              src={shop.heroImage}
              alt={shop.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(15,23,42,0.1), rgba(15,23,42,0.7))',
              }}
            />
            <Avatar
              size={64}
              style={{
                position: 'absolute',
                left: 18,
                bottom: 18,
                background: publicTheme.ribbon,
                fontWeight: 900,
                fontSize: 22,
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                border: '3px solid #ffffff',
              }}
            >
              {shop.logoText}
            </Avatar>
            <Tag
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                background: 'rgba(255,255,255,0.92)',
                border: 'none',
                color: publicTheme.primary,
                fontWeight: 700,
                borderRadius: 999,
                padding: '3px 10px',
              }}
            >
              Est. {shop.established || '2020'}
            </Tag>
          </div>

          {/* Quick Metrics */}
          <Row gutter={[8, 8]} style={{ marginTop: 12 }}>
            <Col span={8}>
              <div
                style={{
                  background: publicTheme.cardMuted,
                  borderRadius: 14,
                  padding: '8px 10px',
                  textAlign: 'center',
                  border: `1px solid ${publicTheme.softBorder}`,
                }}
              >
                <Text style={{ fontSize: 11, color: publicTheme.subtext, display: 'block' }}>Rating</Text>
                <Text strong style={{ color: publicTheme.text, fontSize: 13 }}>
                  ★ {shop.rating}
                </Text>
              </div>
            </Col>
            <Col span={8}>
              <div
                style={{
                  background: publicTheme.cardMuted,
                  borderRadius: 14,
                  padding: '8px 10px',
                  textAlign: 'center',
                  border: `1px solid ${publicTheme.softBorder}`,
                }}
              >
                <Text style={{ fontSize: 11, color: publicTheme.subtext, display: 'block' }}>Followers</Text>
                <Text strong style={{ color: publicTheme.text, fontSize: 13 }}>
                  {formatCompact(shop.followers || 0)}
                </Text>
              </div>
            </Col>
            <Col span={8}>
              <div
                style={{
                  background: publicTheme.cardMuted,
                  borderRadius: 14,
                  padding: '8px 10px',
                  textAlign: 'center',
                  border: `1px solid ${publicTheme.softBorder}`,
                }}
              >
                <Text style={{ fontSize: 11, color: publicTheme.subtext, display: 'block' }}>Catalog</Text>
                <Text strong style={{ color: publicTheme.text, fontSize: 13 }}>
                  {shopProducts.length} items
                </Text>
              </div>
            </Col>
          </Row>

          {/* BotFather Connection Card */}
          <Card
            style={{
              marginTop: 12,
              borderRadius: 16,
              background: 'rgba(36, 129, 204, 0.06)',
              border: '1px solid rgba(36, 129, 204, 0.22)',
            }}
            styles={{ body: { padding: 12 } }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: '#2481cc',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SendOutlined />
                </div>
                <div>
                  <Text strong style={{ fontSize: 12, display: 'block', color: '#0f172a' }}>
                    Telegram E-Menu
                  </Text>
                  <Text style={{ fontSize: 11, color: '#64748b' }}>@{BOTFATHER_CONFIG.botUsername}</Text>
                </div>
              </div>
              <Button
                size="small"
                type="link"
                onClick={() => {
                  onClose();
                  onOpenTelegram?.(shop);
                }}
                style={{ fontWeight: 700, color: '#2481cc', padding: 0 }}
              >
                Launch ↗
              </Button>
            </div>
          </Card>
        </Col>

        {/* Right Column: Shop Details & Catalog Highlights */}
        <Col xs={24} md={13}>
          <Space orientation="vertical" size={14} style={{ width: '100%' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Tag color="blue" style={{ borderRadius: 6, fontWeight: 700, margin: 0 }}>
                  VERIFIED STORE
                </Tag>
                <Tag color="green" style={{ borderRadius: 6, fontWeight: 700, margin: 0 }}>
                  ACTIVE NOW
                </Tag>
              </div>

              <Title level={3} style={{ margin: 0, color: publicTheme.text }}>
                {shop.name}
              </Title>

              <Text style={{ color: publicTheme.subtext, fontSize: 13 }}>
                <EnvironmentOutlined style={{ marginRight: 4 }} />
                {shop.branch ? shop.branch.toUpperCase() : 'MAIN HUB'} • {shop.established}
              </Text>
            </div>

            <Paragraph style={{ margin: 0, color: publicTheme.subtext, fontSize: 14, lineHeight: 1.6 }}>
              {shop.summary}
            </Paragraph>

            {/* Specialties */}
            <div>
              <Text strong style={{ fontSize: 12, color: publicTheme.text, display: 'block', marginBottom: 6 }}>
                Specialties & Lines:
              </Text>
              <Space wrap size={[6, 6]}>
                {(shop.specialties || []).map((spec) => (
                  <Tag
                    key={spec}
                    style={{
                      borderRadius: 999,
                      background: publicTheme.cardMuted,
                      borderColor: publicTheme.softBorder,
                      fontSize: 12,
                      padding: '2px 10px',
                    }}
                  >
                    {spec}
                  </Tag>
                ))}
              </Space>
            </div>

            {/* Catalog preview row */}
            {shopProducts.length > 0 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Text strong style={{ fontSize: 12, color: publicTheme.text }}>
                    Featured Products ({shopProducts.length})
                  </Text>
                  <Button
                    type="link"
                    size="small"
                    onClick={() => {
                      onClose();
                      navigate(`/shops/${shop.id}`);
                    }}
                    style={{ padding: 0, fontSize: 12 }}
                  >
                    View All <RightOutlined style={{ fontSize: 10 }} />
                  </Button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {shopProducts.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        onClose();
                        navigate(`/products#${item.id}`);
                      }}
                      style={{
                        borderRadius: 12,
                        border: `1px solid ${publicTheme.softBorder}`,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        background: publicTheme.cardMuted,
                        padding: 6,
                        textAlign: 'center',
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 8, marginBottom: 4 }}
                      />
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          display: 'block',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          color: publicTheme.text,
                        }}
                      >
                        {item.name}
                      </Text>
                      <Text style={{ fontSize: 11, color: publicTheme.primary, fontWeight: 800 }}>
                        ${Number(item.price).toFixed(2)}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <Button
                type="primary"
                icon={<ShopOutlined />}
                size="large"
                onClick={() => {
                  onClose();
                  navigate(`/shops/${shop.id}`);
                }}
                style={{
                  flex: 1,
                  borderRadius: 14,
                  background: publicTheme.ribbon,
                  fontWeight: 700,
                  height: 44,
                }}
              >
                Visit Shop Page
              </Button>
              <Button
                icon={<SendOutlined style={{ color: '#2481cc' }} />}
                size="large"
                onClick={() => {
                  onClose();
                  onOpenTelegram?.(shop);
                }}
                style={{
                  borderRadius: 14,
                  borderColor: 'rgba(36, 129, 204, 0.4)',
                  color: '#2481cc',
                  fontWeight: 700,
                  height: 44,
                  background: 'rgba(36, 129, 204, 0.08)',
                }}
              >
                Telegram E-Menu
              </Button>
            </div>
          </Space>
        </Col>
      </Row>
    </Modal>
  );
};

export default ShopQuickViewModal;
