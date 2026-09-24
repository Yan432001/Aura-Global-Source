import React, { useMemo, useState } from 'react';
import { Avatar, Button, Card, Col, Row, Space, Tag, Typography } from 'antd';
import {
  SendOutlined,
  ShopOutlined,
  StarFilled,
} from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { products, shops } from '../../data/shopData';
import { formatCompact, publicTheme } from '../../utils/webTheme';
import TelegramMiniAppModal, { BOTFATHER_CONFIG } from '../../components/web/shared/TelegramMiniAppModal';

const { Paragraph, Text, Title } = Typography;

const Shops = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('q') || '';
  const [telegramShop, setTelegramShop] = useState(null);

  const filteredShops = useMemo(
    () =>
      shops.filter((shop) => {
        const query = search.toLowerCase();
        return (
          shop.name.toLowerCase().includes(query) ||
          shop.summary.toLowerCase().includes(query) ||
          (shop.branch && shop.branch.toLowerCase().includes(query)) ||
          shop.specialties.some((item) => item.toLowerCase().includes(query))
        );
      }),
    [search]
  );

  const handleOpenTelegram = (shop) => {
    setTelegramShop(shop);
  };

  return (
    <div style={{ padding: 0 }}>
      {/* Top Header Frosted Panel - matches image.png exactly */}
      <Card
        className="frosted-panel stagger-rise"
        style={{
          borderRadius: 34,
          border: `1px solid ${publicTheme.border}`,
          boxShadow: publicTheme.shadow,
          background: publicTheme.heroBackground,
          marginBottom: 24,
        }}
        styles={{ body: { padding: 28 } }}
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <Tag
              style={{
                borderRadius: 999,
                border: 'none',
                background: publicTheme.pill,
                color: publicTheme.primary,
                fontWeight: 700,
                padding: '8px 14px',
              }}
            >
              Shop by shop
            </Tag>
            <Tag
              style={{
                borderRadius: 999,
                border: '1px solid rgba(36, 129, 204, 0.25)',
                background: 'rgba(36, 129, 204, 0.08)',
                color: '#2481cc',
                fontWeight: 700,
                padding: '6px 12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <SendOutlined />
              Connected with @BotFather ({BOTFATHER_CONFIG.botUsername})
            </Tag>
          </div>

          <Title
            level={1}
            style={{
              margin: 0,
              color: publicTheme.text,
              fontSize: 'clamp(30px, 4vw, 52px)',
              lineHeight: 1.05,
            }}
          >
            Browse shops first, then view all products inside each shop.
          </Title>

          <Paragraph
            style={{
              margin: 0,
              color: publicTheme.subtext,
              fontSize: 16,
              maxWidth: 760,
            }}
          >
            This page is now a clean shop directory, so visitors are not flooded by products when they first arrive. Each shop has its own detail page with its own products, and is connected to Telegram Mini App E-Menu.
          </Paragraph>

          {search && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <Tag
                closable
                onClose={() => setSearchParams({})}
                style={{
                  padding: '6px 14px',
                  borderRadius: 999,
                  background: publicTheme.cardMuted,
                  border: `1px solid ${publicTheme.softBorder}`,
                  fontSize: 13,
                  color: publicTheme.text,
                }}
              >
                Filtered by: <strong>"{search}"</strong> ({filteredShops.length} shops found)
              </Tag>
            </div>
          )}
        </Space>
      </Card>

      {/* 3-Column Grid Layout - matches image.png exactly */}
      <Row gutter={[18, 18]}>
        {filteredShops.map((shop) => {
          const shopProducts = products.filter((product) => product.shopId === shop.id);

          return (
            <Col xs={24} md={12} xl={8} key={shop.id}>
              <Card
                hoverable
                style={{
                  borderRadius: 28,
                  border: `1px solid ${publicTheme.border}`,
                  background: publicTheme.cardBackground,
                  boxShadow: publicTheme.lightShadow,
                  height: '100%',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                styles={{
                  body: {
                    padding: 18,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  },
                }}
                cover={
                  <div style={{ position: 'relative', height: 220 }}>
                    <img
                      src={shop.heroImage}
                      alt={shop.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background:
                          'linear-gradient(180deg, rgba(31,45,56,0.08), rgba(31,45,56,0.48))',
                      }}
                    />
                    <Avatar
                      size={52}
                      style={{
                        position: 'absolute',
                        left: 18,
                        bottom: 18,
                        background: publicTheme.ribbon,
                        fontWeight: 800,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                      }}
                    >
                      {shop.logoText}
                    </Avatar>
                  </div>
                }
              >
                <Space direction="vertical" size={14} style={{ width: '100%' }}>
                  <div>
                    <FlexRow shop={shop} />
                    <Paragraph
                      style={{
                        margin: '10px 0 0',
                        color: publicTheme.subtext,
                        fontSize: 14,
                        lineHeight: 1.5,
                      }}
                    >
                      {shop.summary}
                    </Paragraph>
                  </div>

                  <Space wrap size={[8, 8]}>
                    {shop.specialties.map((item) => (
                      <Tag
                        key={item}
                        style={{
                          borderRadius: 999,
                          background: publicTheme.cardMuted,
                          borderColor: publicTheme.softBorder,
                          fontSize: 12,
                        }}
                      >
                        {item}
                      </Tag>
                    ))}
                  </Space>

                  {/* 3 Metric Boxes - Products, Followers, Replies */}
                  <Row gutter={[10, 10]}>
                    <Col span={8}>
                      <MetricBox label="Products" value={formatCompact(shopProducts.length)} />
                    </Col>
                    <Col span={8}>
                      <MetricBox label="Followers" value={formatCompact(shop.followers)} />
                    </Col>
                    <Col span={8}>
                      <MetricBox label="Replies" value={shop.responseTime} />
                    </Col>
                  </Row>

                  {/* BotFather Connection Pill */}
                  <div
                    onClick={() => handleOpenTelegram(shop)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: 12,
                      background: 'rgba(36, 129, 204, 0.08)',
                      border: '1px solid rgba(36, 129, 204, 0.2)',
                      fontSize: 11,
                      color: '#2481cc',
                      cursor: 'pointer',
                    }}
                  >
                    <span>
                      <SendOutlined style={{ marginRight: 6 }} />
                      <strong>@{BOTFATHER_CONFIG.botUsername}</strong> • E-Menu
                    </span>
                    <span style={{ fontWeight: 700, textDecoration: 'underline' }}>
                      Open to Telegram ↗
                    </span>
                  </div>

                  {/* Bottom Action Buttons: Visit shop (matching image) + Telegram E-Menu */}
                  <Space size={10} wrap style={{ marginTop: 2 }}>
                    <Button
                      type="primary"
                      icon={<ShopOutlined />}
                      onClick={() => navigate(`/shops/${shop.id}`)}
                      style={{
                        height: 44,
                        borderRadius: 16,
                        background: publicTheme.ribbon,
                        border: 'none',
                        fontWeight: 700,
                        paddingInline: 20,
                      }}
                    >
                      Visit shop
                    </Button>
                    <Button
                      type="default"
                      icon={<SendOutlined style={{ color: '#2481cc' }} />}
                      onClick={() => handleOpenTelegram(shop)}
                      style={{
                        height: 44,
                        borderRadius: 16,
                        border: '1px solid rgba(36, 129, 204, 0.3)',
                        background: 'rgba(36, 129, 204, 0.08)',
                        color: '#2481cc',
                        fontWeight: 700,
                        paddingInline: 16,
                      }}
                    >
                      Telegram E-Menu
                    </Button>
                  </Space>
                </Space>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* New Concept: Telegram Mini App BotFather Gateway Modal */}
      <TelegramMiniAppModal
        open={Boolean(telegramShop)}
        onClose={() => setTelegramShop(null)}
        shop={telegramShop}
        allProducts={products}
      />
    </div>
  );
};

const FlexRow = ({ shop }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
    <div>
      <Title level={4} style={{ margin: 0, color: publicTheme.text }}>
        {shop.name}
      </Title>
      <Text style={{ color: publicTheme.subtext, fontSize: 13 }}>
        {shop.established} • {shop.branch}
      </Text>
    </div>
    <Space size={4}>
      <StarFilled style={{ color: publicTheme.warning }} />
      <Text strong style={{ color: publicTheme.text }}>
        {shop.rating}
      </Text>
    </Space>
  </div>
);

const MetricBox = ({ label, value }) => (
  <div
    style={{
      borderRadius: 18,
      background: publicTheme.cardMuted,
      border: `1px solid ${publicTheme.softBorder}`,
      padding: 12,
      textAlign: 'center',
      height: '100%',
    }}
  >
    <Text style={{ display: 'block', color: publicTheme.subtext, fontSize: 11 }}>{label}</Text>
    <Text strong style={{ color: publicTheme.text }}>
      {value}
    </Text>
  </div>
);

export default Shops;
