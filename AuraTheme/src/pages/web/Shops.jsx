import React, { useMemo, useState } from 'react';
import { Avatar, Button, Card, Col, Input, Row, Space, Tag, Typography } from 'antd';
import { RightOutlined, SearchOutlined, ShopOutlined, StarFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { products, shops } from '../../data/shopData';
import { formatCompact, publicTheme } from '../../utils/webTheme';

const { Paragraph, Text, Title } = Typography;

const Shops = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filteredShops = useMemo(
    () =>
      shops.filter((shop) => {
        const query = search.toLowerCase();
        return (
          shop.name.toLowerCase().includes(query) ||
          shop.summary.toLowerCase().includes(query) ||
          shop.specialties.some((item) => item.toLowerCase().includes(query))
        );
      }),
    [search]
  );

  return (
    <div style={{ padding: 0 }}>
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
          <Tag style={{ width: 'fit-content', borderRadius: 999, border: 'none', background: publicTheme.pill, color: publicTheme.primary, fontWeight: 700, padding: '8px 14px' }}>
            Shop by shop
          </Tag>
          <Title level={1} style={{ margin: 0, color: publicTheme.text, fontSize: 'clamp(30px, 4vw, 52px)', lineHeight: 1.05 }}>
            Browse shops first, then view all products inside each shop.
          </Title>
          <Paragraph style={{ margin: 0, color: publicTheme.subtext, fontSize: 16, maxWidth: 760 }}>
            This page is now a clean shop directory, so visitors are not flooded by products when they first arrive. Each shop has its own detail page with its own products.
          </Paragraph>
          <Input
            size="large"
            prefix={<SearchOutlined style={{ color: publicTheme.subtext }} />}
            placeholder="Search shops, specialties, or service focus"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{ maxWidth: 480, borderRadius: 999, height: 48 }}
          />
        </Space>
      </Card>

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
                }}
                styles={{ body: { padding: 18 } }}
                cover={
                  <div style={{ position: 'relative', height: 220 }}>
                    <img src={shop.heroImage} alt={shop.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(31,45,56,0.08), rgba(31,45,56,0.48))' }} />
                    <Avatar
                      size={52}
                      style={{
                        position: 'absolute',
                        left: 18,
                        bottom: 18,
                        background: publicTheme.ribbon,
                        fontWeight: 800,
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
                    <Paragraph style={{ margin: '10px 0 0', color: publicTheme.subtext }}>
                      {shop.summary}
                    </Paragraph>
                  </div>

                  <Space wrap size={[8, 8]}>
                    {shop.specialties.map((item) => (
                      <Tag key={item} style={{ borderRadius: 999, background: publicTheme.cardMuted, borderColor: publicTheme.softBorder }}>
                        {item}
                      </Tag>
                    ))}
                  </Space>

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

                  <Button
                    type="primary"
                    icon={<ShopOutlined />}
                    onClick={() => navigate(`/shop/${shop.id}`)}
                    style={{
                      height: 46,
                      borderRadius: 16,
                      background: publicTheme.ribbon,
                      border: 'none',
                      fontWeight: 700,
                    }}
                  >
                    Visit shop
                  </Button>
                </Space>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

const FlexRow = ({ shop }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
    <div>
      <Title level={4} style={{ margin: 0, color: publicTheme.text }}>
        {shop.name}
      </Title>
      <Text style={{ color: publicTheme.subtext }}>{shop.established} • {shop.branch}</Text>
    </div>
    <Space size={4}>
      <StarFilled style={{ color: publicTheme.warning }} />
      <Text strong style={{ color: publicTheme.text }}>{shop.rating}</Text>
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
    <Text strong style={{ color: publicTheme.text }}>{value}</Text>
  </div>
);

export default Shops;
