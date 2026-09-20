import React, { useEffect, useMemo, useState } from 'react';
import { Avatar, Badge, Button, Card, Col, Flex, Grid, Rate, Row, Space, Tag, Typography } from 'antd';
import {
  ArrowRightOutlined,
  CustomerServiceOutlined,
  HeartOutlined,
  LockOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  ShoppingCartOutlined,
  StarFilled,
  SyncOutlined,
  ThunderboltOutlined,
  TruckOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { products, shopCategories } from '../../data/shopData';
import { formatCurrency, publicTheme } from '../../utils/webTheme';

const { Paragraph, Text, Title } = Typography;
const { useBreakpoint } = Grid;

const nova = {
  ink: '#1c2333',
  sub: '#6b7590',
  border: 'rgba(47, 111, 237, 0.14)',
  soft: '#eef3ff',
  accent: publicTheme.primary,
  sunset: publicTheme.accent,
};

const Blob = ({ size, top, left, right, bottom, color, blur = 40, opacity = 0.5 }) => (
  <div
    aria-hidden
    style={{
      position: 'absolute',
      width: size,
      height: size,
      top,
      left,
      right,
      bottom,
      background: color,
      borderRadius: '50%',
      filter: `blur(${blur}px)`,
      opacity,
      pointerEvents: 'none',
      zIndex: 0,
    }}
  />
);

const featureRow = [
  { icon: <TruckOutlined />, title: 'Free Shipping', text: 'On orders over $50' },
  { icon: <LockOutlined />, title: 'Secure Payments', text: '100% secure checkout' },
  { icon: <SyncOutlined />, title: 'Easy Returns', text: '30-day return policy' },
  { icon: <CustomerServiceOutlined />, title: '24/7 Support', text: 'Always here to help' },
];

const trustRow = [
  { icon: <SafetyCertificateOutlined />, title: 'Premium Quality', text: 'Made of the finest materials' },
  { icon: <RocketOutlined />, title: 'Fast Delivery', text: 'Quick and reliable shipping' },
  { icon: <LockOutlined />, title: 'Secure Checkout', text: 'Your data is protected' },
  { icon: <StarFilled />, title: 'Customer Satisfaction', text: '100% guarantee' },
];

const useCountdown = (hours = 30) => {
  const [target] = useState(() => Date.now() + hours * 60 * 60 * 1000);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const remaining = Math.max(target - now, 0);
  const totalSeconds = Math.floor(remaining / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
};

const CountdownBox = ({ value, label }) => (
  <div
    style={{
      minWidth: 56,
      textAlign: 'center',
      padding: '8px 6px',
      borderRadius: 12,
      background: 'rgba(255,255,255,0.16)',
    }}
  >
    <div style={{ fontSize: 20, fontWeight: 800, color: 'white', lineHeight: 1 }}>
      {String(value).padStart(2, '0')}
    </div>
    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.78)', marginTop: 4, textTransform: 'uppercase' }}>
      {label}
    </div>
  </div>
);

const ProductCard = ({ product, badge }) => {
  const navigate = useNavigate();
  const discount = product.originalPrice
    ? Math.round(100 - (product.price / product.originalPrice) * 100)
    : 0;

  return (
    <Card
      hoverable
      onClick={() => navigate('/products')}
      style={{
        borderRadius: 18,
        border: `1px solid ${nova.border}`,
        overflow: 'hidden',
        height: '100%',
      }}
      styles={{ body: { padding: 14 } }}
      cover={
        <div style={{ position: 'relative', aspectRatio: '1 / 1', background: nova.soft }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {(badge || discount > 0) && (
            <Tag
              style={{
                position: 'absolute',
                top: 10,
                left: 10,
                margin: 0,
                borderRadius: 999,
                border: 'none',
                background: badge === 'New' ? nova.accent : '#e0393f',
                color: 'white',
                fontWeight: 700,
                fontSize: 11,
              }}
            >
              {badge || `-${discount}%`}
            </Tag>
          )}
          <Button
            shape="circle"
            icon={<HeartOutlined />}
            onClick={(event) => event.stopPropagation()}
            style={{ position: 'absolute', top: 10, right: 10, border: 'none', boxShadow: '0 6px 16px rgba(0,0,0,0.12)' }}
          />
        </div>
      }
    >
      <Space direction="vertical" size={4} style={{ width: '100%' }}>
        <Text strong ellipsis style={{ color: nova.ink, fontSize: 14 }}>
          {product.name}
        </Text>
        <Rate disabled defaultValue={Math.round(product.rating)} style={{ fontSize: 11 }} />
        <Flex align="center" gap={8}>
          <Text strong style={{ color: nova.ink, fontSize: 16 }}>{formatCurrency(product.price)}</Text>
          {product.originalPrice && (
            <Text delete style={{ color: nova.sub, fontSize: 12 }}>{formatCurrency(product.originalPrice)}</Text>
          )}
        </Flex>
      </Space>
    </Card>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const countdown = useCountdown(30);

  const heroProduct = products[0];
  const floatingPicks = useMemo(() => products.slice(1, 5), []);
  const newArrivals = useMemo(() => products.slice(0, 6), []);
  const bestSellers = useMemo(() => products.slice(6, 9), []);
  const categoryTiles = useMemo(() => shopCategories.slice(0, 6), []);

  const isDesktop = screens.lg;

  return (
    <div style={{ padding: 0 }}>
      {/* Hero */}
      <Card
        className="stagger-rise"
        style={{
          borderRadius: 28,
          border: `1px solid ${nova.border}`,
          background: publicTheme.heroBackground,
          marginBottom: 20,
          overflow: 'hidden',
          position: 'relative',
        }}
        styles={{ body: { padding: screens.xs ? 20 : 36, position: 'relative', zIndex: 1 } }}
      >
        <Blob size={220} top={-80} right={-60} color={publicTheme.primary} opacity={0.14} />
        <Blob size={160} bottom={-60} left="38%" color={publicTheme.accent} opacity={0.14} />
        <StarFilled style={{ position: 'absolute', top: 26, right: '32%', color: '#ffb03d', fontSize: 22, opacity: 0.8, zIndex: 1 }} />
        <Row gutter={[24, 24]} align="middle" style={{ position: 'relative', zIndex: 1 }}>
          <Col xs={24} lg={12}>
            <Space direction="vertical" size={16}>
              <Tag style={{ width: 'fit-content', margin: 0, borderRadius: 999, border: 'none', background: nova.soft, color: nova.accent, fontWeight: 700, padding: '6px 12px' }}>
                Trending Now
              </Tag>
              <Title level={1} style={{ margin: 0, color: nova.ink, fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.05 }}>
                Discover Products You&apos;ll Love
              </Title>
              <Paragraph style={{ margin: 0, color: nova.sub, fontSize: 16, maxWidth: 460 }}>
                Shop the latest trending products curated for modern lifestyles.
              </Paragraph>
              <Space wrap size={12}>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => navigate('/products')}
                  style={{ height: 48, borderRadius: 999, background: nova.accent, border: 'none', fontWeight: 700, paddingInline: 26, boxShadow: '0 14px 30px rgba(47,111,237,0.28)' }}
                >
                  Shop Now
                </Button>
                <Button
                  size="large"
                  onClick={() => navigate('/shop')}
                  style={{ height: 48, borderRadius: 999, borderColor: nova.sunset, color: nova.sunset, fontWeight: 700, paddingInline: 26 }}
                >
                  Explore Collection
                </Button>
              </Space>
              <Flex align="center" gap={10}>
                <Avatar.Group max={{ count: 4 }} size={30}>
                  {products.slice(0, 4).map((product) => (
                    <Avatar key={product.id} src={product.image} />
                  ))}
                </Avatar.Group>
                <Text style={{ color: nova.sub, fontSize: 13 }}>Loved by 50,000+ customers</Text>
              </Flex>
            </Space>
          </Col>

          <Col xs={24} lg={12}>
            <div style={{ position: 'relative', maxWidth: 460, margin: '0 auto' }}>
              <div style={{ borderRadius: 24, overflow: 'hidden', aspectRatio: '4 / 5', background: nova.soft }}>
                <img
                  src={heroProduct?.image}
                  alt={heroProduct?.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {isDesktop ? (
                floatingPicks.map((product, index) => {
                  const positions = [
                    { top: -14, left: -30 },
                    { top: -10, right: -34 },
                    { bottom: 90, right: -40 },
                    { bottom: -16, left: -20 },
                  ];
                  return (
                    <div
                      key={product.id}
                      style={{
                        position: 'absolute',
                        ...positions[index],
                        background: 'white',
                        borderRadius: 16,
                        padding: '10px 14px',
                        boxShadow: '0 16px 36px rgba(20,20,22,0.14)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        maxWidth: 170,
                      }}
                    >
                      <Avatar shape="square" size={38} src={product.image} style={{ borderRadius: 10 }} />
                      <div>
                        <Text style={{ fontSize: 11, color: nova.sub, display: 'block' }}>{product.name}</Text>
                        <Text strong style={{ fontSize: 13, color: nova.ink }}>{formatCurrency(product.price)}</Text>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ display: 'flex', gap: 10, overflowX: 'auto', marginTop: 14, paddingBottom: 4 }}>
                  {floatingPicks.map((product) => (
                    <div
                      key={product.id}
                      style={{
                        flex: '0 0 auto',
                        background: 'white',
                        border: `1px solid ${nova.border}`,
                        borderRadius: 16,
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                      }}
                    >
                      <Avatar shape="square" size={34} src={product.image} style={{ borderRadius: 8 }} />
                      <div>
                        <Text style={{ fontSize: 11, color: nova.sub, display: 'block' }}>{product.name}</Text>
                        <Text strong style={{ fontSize: 12, color: nova.ink }}>{formatCurrency(product.price)}</Text>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Card>

      {/* Feature row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {featureRow.map((item) => (
          <Col xs={12} sm={12} md={6} key={item.title}>
            <Card style={{ borderRadius: 20, border: `1px solid ${nova.border}`, textAlign: 'center', height: '100%' }} styles={{ body: { padding: 18 } }}>
              <div style={{ fontSize: 24, color: nova.accent, marginBottom: 8 }}>{item.icon}</div>
              <Text strong style={{ display: 'block', color: nova.ink, fontSize: 13 }}>{item.title}</Text>
              <Text style={{ color: nova.sub, fontSize: 12 }}>{item.text}</Text>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Shop by categories */}
      <Space direction="vertical" size={4} style={{ width: '100%', marginBottom: 14 }}>
        <Flex justify="space-between" align="center">
          <Title level={3} style={{ margin: 0, color: nova.ink }}>Shop by Categories</Title>
          <Button type="link" onClick={() => navigate('/shop')} style={{ color: nova.accent, fontWeight: 700, padding: 0 }}>
            View All Categories <ArrowRightOutlined />
          </Button>
        </Flex>
      </Space>
      <Row gutter={[14, 14]} style={{ marginBottom: 28 }}>
        {categoryTiles.map((category) => {
          const sampleProduct = products.find((product) => product.category === category.id) || products[0];
          return (
            <Col xs={12} sm={8} md={4} key={category.id}>
              <div
                onClick={() => navigate('/shop')}
                style={{ cursor: 'pointer', textAlign: 'center' }}
              >
                <div style={{ borderRadius: 20, overflow: 'hidden', aspectRatio: '1 / 1', background: nova.soft, marginBottom: 8 }}>
                  <img
                    src={sampleProduct.image}
                    alt={category.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <Text strong style={{ color: nova.ink, fontSize: 13 }}>{category.name.split(' ')[0]}</Text>
              </div>
            </Col>
          );
        })}
      </Row>

      {/* New arrivals */}
      <Space direction="vertical" size={4} style={{ width: '100%', marginBottom: 14 }}>
        <Flex justify="space-between" align="center">
          <Title level={3} style={{ margin: 0, color: nova.ink }}>New Arrivals</Title>
          <Button type="link" onClick={() => navigate('/products')} style={{ color: nova.accent, fontWeight: 700, padding: 0 }}>
            View All New Arrivals <ArrowRightOutlined />
          </Button>
        </Flex>
      </Space>
      <Row gutter={[16, 16]} style={{ marginBottom: 28 }}>
        {newArrivals.map((product, index) => (
          <Col xs={12} sm={8} lg={4} key={product.id}>
            <ProductCard product={product} badge={index < 2 ? 'New' : undefined} />
          </Col>
        ))}
      </Row>

      {/* Best sellers */}
      <Space direction="vertical" size={4} style={{ width: '100%', marginBottom: 14 }}>
        <Flex justify="space-between" align="center">
          <Title level={3} style={{ margin: 0, color: nova.ink }}>Best Sellers</Title>
          <Button type="link" onClick={() => navigate('/products')} style={{ color: nova.accent, fontWeight: 700, padding: 0 }}>
            View All Best Sellers <ArrowRightOutlined />
          </Button>
        </Flex>
      </Space>
      <Row gutter={[18, 18]} style={{ marginBottom: 28 }}>
        {bestSellers.map((product) => (
          <Col xs={24} sm={12} md={8} key={product.id}>
            <Badge.Ribbon text="Bestseller" color={nova.accent}>
              <Card
                hoverable
                onClick={() => navigate('/products')}
                style={{ borderRadius: 22, border: `1px solid ${nova.border}`, overflow: 'hidden' }}
                styles={{ body: { padding: 18 } }}
                cover={
                  <div style={{ aspectRatio: '4 / 3', background: nova.soft }}>
                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                }
              >
                <Text strong style={{ display: 'block', color: nova.ink, fontSize: 16, marginBottom: 4 }}>{product.name}</Text>
                <Text style={{ color: nova.sub, fontSize: 13, display: 'block', marginBottom: 10 }}>
                  {product.description}
                </Text>
                <Flex justify="space-between" align="center">
                  <Text strong style={{ color: nova.ink, fontSize: 18 }}>{formatCurrency(product.price)}</Text>
                  <Button
                    icon={<ShoppingCartOutlined />}
                    onClick={(event) => event.stopPropagation()}
                    style={{ borderRadius: 999, background: nova.accent, color: 'white', border: 'none', fontWeight: 700 }}
                  >
                    Quick Add
                  </Button>
                </Flex>
              </Card>
            </Badge.Ribbon>
          </Col>
        ))}
      </Row>

      {/* Flash sale + collection */}
      <Row gutter={[18, 18]} style={{ marginBottom: 28 }}>
        <Col xs={24} md={14}>
          <Card
            style={{ borderRadius: 26, border: 'none', height: '100%', background: 'linear-gradient(120deg, #ff5f2e 0%, #ff8a3d 100%)' }}
            styles={{ body: { padding: screens.xs ? 22 : 30 } }}
          >
            <Flex vertical={!screens.sm} justify="space-between" align={screens.sm ? 'center' : 'flex-start'} gap={20}>
              <Space direction="vertical" size={10}>
                <Tag style={{ width: 'fit-content', margin: 0, borderRadius: 999, border: 'none', background: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 700 }}>
                  <ThunderboltOutlined /> Limited Time
                </Tag>
                <Title level={2} style={{ margin: 0, color: 'white' }}>Flash Sale</Title>
                <Text style={{ color: 'rgba(255,255,255,0.86)' }}>Up To 70% Off</Text>
                <Button
                  onClick={() => navigate('/products')}
                  style={{ marginTop: 6, height: 44, borderRadius: 999, background: 'white', color: '#ff5f2e', border: 'none', fontWeight: 800 }}
                >
                  Shop Sale Now
                </Button>
              </Space>
              <Space size={8}>
                <CountdownBox value={countdown.days} label="Days" />
                <CountdownBox value={countdown.hours} label="Hours" />
                <CountdownBox value={countdown.minutes} label="Min" />
                <CountdownBox value={countdown.seconds} label="Sec" />
              </Space>
            </Flex>
          </Card>
        </Col>

        <Col xs={24} md={10}>
          <Card
            style={{ borderRadius: 26, border: 'none', height: '100%', background: nova.ink }}
            styles={{ body: { padding: screens.xs ? 22 : 30 } }}
          >
            <Space direction="vertical" size={10}>
              <Text style={{ color: 'rgba(255,255,255,0.72)' }}>New Collection</Text>
              <Title level={3} style={{ margin: 0, color: 'white' }}>Summer 2025</Title>
              <Paragraph style={{ margin: 0, color: 'rgba(255,255,255,0.78)' }}>
                Discover the latest trends and fresh styles.
              </Paragraph>
              <Button
                onClick={() => navigate('/shop')}
                style={{ marginTop: 4, height: 44, borderRadius: 999, background: 'white', color: nova.ink, border: 'none', fontWeight: 800 }}
              >
                Shop Collection
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Trust row */}
      <Row gutter={[16, 16]}>
        {trustRow.map((item) => (
          <Col xs={12} sm={12} md={6} key={item.title}>
            <Flex align="center" gap={12} style={{ padding: '14px 4px' }}>
              <div style={{ fontSize: 20, color: nova.accent }}>{item.icon}</div>
              <div>
                <Text strong style={{ display: 'block', color: nova.ink, fontSize: 13 }}>{item.title}</Text>
                <Text style={{ color: nova.sub, fontSize: 12 }}>{item.text}</Text>
              </div>
            </Flex>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Home;
