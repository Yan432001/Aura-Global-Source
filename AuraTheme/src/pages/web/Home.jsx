import React, { useState, useMemo, useEffect } from 'react';
import {
  Typography,
  Row,
  Col,
  Card,
  Button,
  Avatar,
  Grid,
  Space,
  message
} from 'antd';
import {
  ArrowRightOutlined,
  SendOutlined,
  ShopOutlined,
  SafetyCertificateOutlined,
  RocketOutlined,
  CustomerServiceOutlined,
  FireOutlined,
  ThunderboltOutlined,
  LockOutlined,
  SyncOutlined,
  StarFilled,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import simpleData from '../../../../data/simpleData';
import { useCart } from '../../contexts/CartContext';
import { publicTheme, formatCurrency } from '../../utils/webTheme';

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const useCountdown = (hours = 24) => {
  const [target] = useState(() => Date.now() + hours * 60 * 60 * 1000);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const remaining = Math.max(target - now, 0);
  const totalSeconds = Math.floor(remaining / 1000);
  return {
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
};

export default function Home() {
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const countdown = useCountdown(18);
  const { addItem } = useCart();
  const [activeCategory, setActiveCategory] = useState('all');

  const stores = simpleData.stores || [];
  const categories = simpleData.categories || [];
  const products = simpleData.products || [];

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter((p) => Number(p.category_id) === Number(activeCategory));
  }, [products, activeCategory]);

  const handleAddToCart = (product, e) => {
    if (e) e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    message.success(`${product.name} added to cart!`);
  };

  return (
    <div style={{ width: '100%', paddingBottom: 48 }}>
      {/* 1. Full-Screen Hero Banner using Default Theme Colors */}
      <div
        className="stagger-rise"
        style={{
          width: '100%',
          borderRadius: 28,
          background: publicTheme.heroBackground,
          border: `1px solid ${publicTheme.border}`,
          boxShadow: publicTheme.shadow,
          position: 'relative',
          overflow: 'hidden',
          padding: screens.xs ? '32px 20px' : screens.md ? '48px 44px' : '56px 52px',
          marginBottom: 36,
        }}
      >
        {/* Decorative ambient color accents using default palette */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            width: 320,
            height: 320,
            top: -60,
            right: -60,
            background: publicTheme.primary,
            borderRadius: '50%',
            filter: 'blur(70px)',
            opacity: 0.12,
            pointerEvents: 'none',
          }}
        />
        <div
          aria-hidden
          style={{
            position: 'absolute',
            width: 280,
            height: 280,
            bottom: -60,
            left: '30%',
            background: publicTheme.accent,
            borderRadius: '50%',
            filter: 'blur(70px)',
            opacity: 0.1,
            pointerEvents: 'none',
          }}
        />

        <Row gutter={[40, 36]} align="middle" style={{ position: 'relative', zIndex: 1 }}>
          <Col xs={24} lg={13}>
            {/* Header Kicker */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: publicTheme.primary,
                  boxShadow: `0 0 10px ${publicTheme.primary}`,
                }}
              />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  color: publicTheme.primary,
                  textTransform: 'uppercase',
                }}
              >
                Multi-Store E-Menu & Telegram Mini App
              </span>
            </div>

            <Title
              level={1}
              style={{
                color: publicTheme.text,
                fontSize: screens.xs ? 32 : screens.md ? 44 : 52,
                fontWeight: 800,
                lineHeight: 1.12,
                letterSpacing: '-0.02em',
                marginBottom: 16,
              }}
            >
              Order Seamlessly with{' '}
              <span style={{ color: publicTheme.primary }}>Telegram Mini App</span> & Multi-Store E-Menu
            </Title>

            <Paragraph
              style={{
                color: publicTheme.subtext,
                fontSize: screens.xs ? 14 : 16,
                lineHeight: 1.6,
                maxWidth: 580,
                marginBottom: 28,
              }}
            >
              Browse artisan food, specialty coffee, and curated lifestyle collections. Place orders
              directly inside Telegram or web, with instant automated dispatch to shop staff groups
              for fast contactless dining and takeaway.
            </Paragraph>

            <Space wrap size={14}>
              <Button
                type="primary"
                size="large"
                icon={<SendOutlined />}
                onClick={() => navigate('/shop/sbc-store')}
                style={{
                  height: 48,
                  borderRadius: 14,
                  background: publicTheme.primary,
                  borderColor: publicTheme.primary,
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: 14,
                  paddingInline: 26,
                  boxShadow: '0 10px 24px rgba(47, 111, 237, 0.28)',
                }}
              >
                Launch Telegram Mini App E-Menu
              </Button>
              <Button
                size="large"
                icon={<ShopOutlined />}
                onClick={() => navigate('/products')}
                style={{
                  height: 48,
                  borderRadius: 14,
                  background: '#ffffff',
                  borderColor: publicTheme.accent,
                  color: publicTheme.accent,
                  fontWeight: 700,
                  fontSize: 14,
                  paddingInline: 24,
                }}
              >
                Browse Web Catalog
              </Button>
            </Space>

            {/* Quick Metrics */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: screens.xs ? 14 : 24,
                marginTop: 32,
                paddingTop: 24,
                borderTop: `1px solid ${publicTheme.softBorder}`,
              }}
            >
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: publicTheme.text }}>4 Shops</div>
                <div style={{ fontSize: 12, color: publicTheme.subtext }}>Active Concepts</div>
              </div>
              <div style={{ width: 1, height: 28, background: publicTheme.softBorder }} />
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: publicTheme.primary }}>&lt; 1s</div>
                <div style={{ fontSize: 12, color: publicTheme.subtext }}>Group Dispatch</div>
              </div>
              <div style={{ width: 1, height: 28, background: publicTheme.softBorder }} />
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: publicTheme.accent }}>4.9 ★</div>
                <div style={{ fontSize: 12, color: publicTheme.subtext }}>User Satisfaction</div>
              </div>
            </div>
          </Col>

          {/* Interactive Telegram Order Simulator Card using Default Theme */}
          <Col xs={24} lg={11}>
            <div
              style={{
                borderRadius: 24,
                background: 'rgba(255, 255, 255, 0.95)',
                border: `1px solid ${publicTheme.border}`,
                padding: 24,
                backdropFilter: 'blur(20px)',
                boxShadow: publicTheme.lightShadow,
              }}
            >
              {/* Telegram Card Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: 14,
                  borderBottom: `1px solid ${publicTheme.softBorder}`,
                  marginBottom: 16,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar
                    src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=100&h=100&fit=crop"
                    size={40}
                    style={{ border: `2px solid ${publicTheme.primary}` }}
                  />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: publicTheme.text }}>
                      ☕ Aura Coffee Kitchen Group
                    </div>
                    <div style={{ fontSize: 11, color: publicTheme.success, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: publicTheme.success }} />
                      Telegram Bot Live
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: 999,
                    background: 'rgba(47, 111, 237, 0.1)',
                    color: publicTheme.primary,
                  }}
                >
                  Auto-Sync
                </span>
              </div>

              {/* Sample Dispatched Order Receipt */}
              <div
                style={{
                  background: 'rgba(240, 244, 255, 0.85)',
                  borderRadius: 16,
                  padding: 16,
                  border: `1px solid ${publicTheme.softBorder}`,
                  fontFamily: 'monospace',
                  fontSize: 12,
                  lineHeight: 1.55,
                  color: publicTheme.text,
                }}
              >
                <div style={{ color: publicTheme.primary, fontWeight: 'bold', marginBottom: 6 }}>
                  🔔 NEW SHOP ORDER #TMA-892410
                </div>
                <div>👤 Customer: Elena Rostova</div>
                <div>📍 Table #04 · Dine-In</div>
                <div>📝 Note: Extra oat milk & double shot</div>
                <div style={{ margin: '8px 0', borderTop: `1px dashed ${publicTheme.softBorder}` }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>2x Spanish Iced Latte</span>
                  <span style={{ fontWeight: 'bold' }}>$8.50</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>1x Golden Almond Croissant</span>
                  <span style={{ fontWeight: 'bold' }}>$3.75</span>
                </div>
                <div style={{ margin: '8px 0', borderTop: `1px solid ${publicTheme.softBorder}` }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: publicTheme.success, fontWeight: 'bold' }}>
                  <span>TOTAL TO COLLECT:</span>
                  <span>$12.25</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <Button
                  block
                  type="primary"
                  onClick={() => navigate('/shop/sbc-store')}
                  style={{
                    height: 40,
                    borderRadius: 12,
                    background: publicTheme.primary,
                    fontWeight: 700,
                    border: 'none',
                  }}
                >
                  Open SBC Coffee E-Menu
                </Button>
                <Button
                  onClick={() => navigate('/shop/aura-bakery')}
                  style={{
                    height: 40,
                    borderRadius: 12,
                    background: 'white',
                    borderColor: publicTheme.border,
                    color: publicTheme.text,
                    fontWeight: 600,
                  }}
                >
                  Bakery Menu
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* 2. Connected Multi-Store Concept Showcase (Full Screen 4-Card Layout) */}
      <div style={{ width: '100%', marginBottom: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: publicTheme.primary, textTransform: 'uppercase', marginBottom: 4 }}>
              Multi-Concept Brands
            </div>
            <Title level={2} style={{ margin: 0, fontWeight: 800, color: publicTheme.text }}>
              Explore Our Shops & E-Menus
            </Title>
          </div>
          <Button
            type="link"
            onClick={() => navigate('/shops')}
            style={{ fontWeight: 700, color: publicTheme.primary, padding: 0 }}
          >
            All Locations <ArrowRightOutlined />
          </Button>
        </div>

        <Row gutter={[20, 20]} style={{ width: '100%', margin: 0 }}>
          {stores.map((store) => (
            <Col xs={24} sm={12} lg={6} key={store.id} style={{ padding: '0 10px' }}>
              <Card
                hoverable
                onClick={() => navigate(`/shop/${store.slug}`)}
                style={{
                  borderRadius: 22,
                  border: `1px solid ${publicTheme.border}`,
                  overflow: 'hidden',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#ffffff',
                  boxShadow: publicTheme.lightShadow,
                }}
                styles={{
                  body: {
                    padding: 16,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  },
                }}
                cover={
                  <div style={{ position: 'relative', height: 140, overflow: 'hidden' }}>
                    <img
                      src={store.banner}
                      alt={store.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(28, 35, 51, 0.75) 0%, transparent 60%)',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 10,
                        left: 12,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <Avatar
                        src={store.logo}
                        size={38}
                        style={{ border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
                      />
                      <span style={{ color: 'white', fontWeight: 700, fontSize: 13, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                        {store.name}
                      </span>
                    </div>
                  </div>
                }
              >
                <div>
                  <p style={{ fontSize: 12, color: publicTheme.subtext, margin: '0 0 10px', lineHeight: 1.45, minHeight: 36 }}>
                    {store.tagline}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: publicTheme.subtext, marginBottom: 6 }}>
                    <span style={{ color: publicTheme.accent, fontWeight: 'bold' }}>★ {store.rating || '4.9'}</span>
                    <span>·</span>
                    <span>{store.hours}</span>
                  </div>
                  <div style={{ fontSize: 11, color: publicTheme.primary, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <SendOutlined style={{ fontSize: 10 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      Group: {store.telegram_group_name?.split(' ')[1] || 'Staff Group'}
                    </span>
                  </div>
                </div>

                <Button
                  block
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/shop/${store.slug}`);
                  }}
                  style={{
                    marginTop: 14,
                    height: 38,
                    borderRadius: 12,
                    background: 'rgba(240, 244, 255, 0.7)',
                    borderColor: publicTheme.border,
                    color: publicTheme.primary,
                    fontWeight: 700,
                    fontSize: 12,
                  }}
                >
                  Open E-Menu →
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 3. Telegram Mini App Ordering Flow (Full Screen 3-Card Row) */}
      <div
        style={{
          width: '100%',
          borderRadius: 26,
          background: 'rgba(255, 255, 255, 0.85)',
          border: `1px solid ${publicTheme.border}`,
          padding: screens.xs ? '24px 18px' : '36px 36px',
          marginBottom: 40,
          boxShadow: publicTheme.lightShadow,
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 30px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: publicTheme.primary, textTransform: 'uppercase', marginBottom: 4 }}>
            Contactless Ordering
          </div>
          <Title level={3} style={{ margin: 0, fontWeight: 800, color: publicTheme.text }}>
            How Telegram Mini App Ordering Works
          </Title>
          <Paragraph style={{ color: publicTheme.subtext, fontSize: 14, marginTop: 6 }}>
            No app store download or manual signup. Guests scan table QR or open via Telegram directly.
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <div
              style={{
                background: '#ffffff',
                borderRadius: 20,
                padding: 24,
                border: `1px solid ${publicTheme.softBorder}`,
                height: '100%',
                boxShadow: '0 4px 12px rgba(47, 111, 237, 0.05)',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: 'rgba(47, 111, 237, 0.1)',
                  color: publicTheme.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginBottom: 16,
                }}
              >
                1
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: publicTheme.text, marginBottom: 6 }}>
                Open Mini App
              </div>
              <p style={{ fontSize: 13, color: publicTheme.subtext, margin: 0, lineHeight: 1.55 }}>
                Tap the bot or scan the table QR code. The Telegram WebApp launches immediately with full catalog and pricing.
              </p>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div
              style={{
                background: '#ffffff',
                borderRadius: 20,
                padding: 24,
                border: `1px solid ${publicTheme.softBorder}`,
                height: '100%',
                boxShadow: '0 4px 12px rgba(47, 111, 237, 0.05)',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: 'rgba(255, 122, 61, 0.1)',
                  color: publicTheme.accent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginBottom: 16,
                }}
              >
                2
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: publicTheme.text, marginBottom: 6 }}>
                Select & Customize
              </div>
              <p style={{ fontSize: 13, color: publicTheme.subtext, margin: 0, lineHeight: 1.55 }}>
                Pick drinks, fresh bakery, or healthy bowls. Add your table number, dietary notes, and customer phone.
              </p>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div
              style={{
                background: '#ffffff',
                borderRadius: 20,
                padding: 24,
                border: `1px solid ${publicTheme.softBorder}`,
                height: '100%',
                boxShadow: '0 4px 12px rgba(47, 111, 237, 0.05)',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: 'rgba(34, 197, 94, 0.1)',
                  color: publicTheme.success,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginBottom: 16,
                }}
              >
                3
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: publicTheme.text, marginBottom: 6 }}>
                Shop Group Dispatch
              </div>
              <p style={{ fontSize: 13, color: publicTheme.subtext, margin: 0, lineHeight: 1.55 }}>
                Orders transmit directly to the shop’s Telegram kitchen group with formatted itemized tickets for immediate prep.
              </p>
            </div>
          </Col>
        </Row>
      </div>

      {/* 4. Full-Screen Products Showcase with Category Filters */}
      <div style={{ width: '100%', marginBottom: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: publicTheme.primary, textTransform: 'uppercase', marginBottom: 4 }}>
              Fresh Selections
            </div>
            <Title level={2} style={{ margin: 0, fontWeight: 800, color: publicTheme.text }}>
              Featured Products & Items
            </Title>
          </div>
          <Button
            type="link"
            onClick={() => navigate('/products')}
            style={{ fontWeight: 700, color: publicTheme.primary, padding: 0 }}
          >
            View Full Menu <ArrowRightOutlined />
          </Button>
        </div>

        {/* Category Tabs */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            paddingBottom: 12,
            marginBottom: 20,
          }}
        >
          <Button
            onClick={() => setActiveCategory('all')}
            style={{
              borderRadius: 20,
              fontWeight: 700,
              fontSize: 12,
              background: activeCategory === 'all' ? publicTheme.primary : '#ffffff',
              color: activeCategory === 'all' ? '#ffffff' : publicTheme.text,
              borderColor: activeCategory === 'all' ? publicTheme.primary : publicTheme.border,
            }}
          >
            All Products ({products.length})
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                borderRadius: 20,
                fontWeight: 700,
                fontSize: 12,
                background: activeCategory === cat.id ? publicTheme.primary : '#ffffff',
                color: activeCategory === cat.id ? '#ffffff' : publicTheme.text,
                borderColor: activeCategory === cat.id ? publicTheme.primary : publicTheme.border,
              }}
            >
              {cat.icon ? `${cat.icon} ` : ''}{cat.name}
            </Button>
          ))}
        </div>

        {/* Full-Width Products Grid */}
        <Row gutter={[18, 18]} style={{ width: '100%', margin: 0 }}>
          {filteredProducts.map((product) => (
            <Col xs={12} sm={8} md={6} lg={4} key={product.id} style={{ padding: '0 9px' }}>
              <Card
                hoverable
                style={{
                  borderRadius: 20,
                  border: `1px solid ${publicTheme.border}`,
                  overflow: 'hidden',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#ffffff',
                  boxShadow: publicTheme.lightShadow,
                }}
                styles={{
                  body: {
                    padding: 14,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  },
                }}
                cover={
                  <div style={{ position: 'relative', aspectRatio: '1 / 1', overflow: 'hidden', background: '#f8fafc' }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {product.badge && (
                      <span
                        style={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          background: 'rgba(28, 35, 51, 0.82)',
                          backdropFilter: 'blur(4px)',
                          color: '#ffffff',
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 6,
                        }}
                      >
                        {product.badge}
                      </span>
                    )}
                  </div>
                }
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: publicTheme.text, marginBottom: 4, lineHeight: 1.3 }}>
                    {product.name}
                  </div>
                  <p
                    style={{
                      fontSize: 11,
                      color: publicTheme.subtext,
                      lineHeight: 1.4,
                      margin: '0 0 10px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {product.details || 'Fresh artisan preparation.'}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 6 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: publicTheme.text }}>
                    ${Number(product.price).toFixed(2)}
                  </div>
                  <Button
                    type="primary"
                    size="small"
                    onClick={(e) => handleAddToCart(product, e)}
                    style={{
                      borderRadius: 10,
                      background: publicTheme.primary,
                      borderColor: publicTheme.primary,
                      fontWeight: 700,
                      fontSize: 11,
                      height: 30,
                    }}
                  >
                    + Add
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 5. Limited Flash Deal in Default Sunset Coral Gradient */}
      <div
        style={{
          width: '100%',
          borderRadius: 26,
          background: publicTheme.sunset,
          color: '#ffffff',
          padding: screens.xs ? '24px 20px' : '36px 40px',
          marginBottom: 36,
          boxShadow: '0 16px 36px rgba(255, 122, 61, 0.28)',
        }}
      >
        <Row gutter={[24, 24]} align="middle" justify="space-between">
          <Col xs={24} md={14}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <FireOutlined style={{ fontSize: 16 }} />
              <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Daily Special Offers
              </span>
            </div>
            <Title level={2} style={{ color: '#ffffff', margin: '0 0 8px', fontWeight: 800 }}>
              Enjoy 20% Off Your First Telegram Order
            </Title>
            <Paragraph style={{ color: 'rgba(255, 255, 255, 0.92)', fontSize: 14, margin: 0, maxWidth: 520 }}>
              Use coupon code <b>AURATG</b> on checkout or mention it in your order notes.
            </Paragraph>
          </Col>
          <Col xs={24} md={10} style={{ textAlign: screens.xs ? 'left' : 'right' }}>
            <div style={{ display: 'inline-flex', gap: 10, marginBottom: 14 }}>
              <div style={{ background: 'rgba(255,255,255,0.22)', padding: '8px 14px', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{String(countdown.hours).padStart(2, '0')}</div>
                <div style={{ fontSize: 9, textTransform: 'uppercase', opacity: 0.85 }}>Hours</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.22)', padding: '8px 14px', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{String(countdown.minutes).padStart(2, '0')}</div>
                <div style={{ fontSize: 9, textTransform: 'uppercase', opacity: 0.85 }}>Mins</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.22)', padding: '8px 14px', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{String(countdown.seconds).padStart(2, '0')}</div>
                <div style={{ fontSize: 9, textTransform: 'uppercase', opacity: 0.85 }}>Secs</div>
              </div>
            </div>
            <div>
              <Button
                size="large"
                onClick={() => navigate('/shop/sbc-store')}
                style={{
                  height: 44,
                  borderRadius: 14,
                  background: '#ffffff',
                  color: publicTheme.accent,
                  border: 'none',
                  fontWeight: 800,
                  fontSize: 13,
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                }}
              >
                Claim Deal in Mini App
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      {/* 6. Full-Width Trust & Quality Pillars */}
      <Row gutter={[16, 16]} style={{ width: '100%', margin: 0 }}>
        {[
          { icon: <SendOutlined />, title: 'Real-Time Telegram Dispatch', text: 'Kitchen tickets sent instantly to shop groups' },
          { icon: <SafetyCertificateOutlined />, title: 'Artisan Quality', text: 'Farm-to-cup beans & European sourdough' },
          { icon: <RocketOutlined />, title: 'Fast Contactless Service', text: 'Dine-in at your table or quick store pickup' },
          { icon: <CustomerServiceOutlined />, title: 'Direct Customer Support', text: 'Dedicated assistance anytime via Telegram' },
        ].map((item, idx) => (
          <Col xs={12} sm={12} md={6} key={idx} style={{ padding: '0 8px' }}>
            <div
              style={{
                background: '#ffffff',
                borderRadius: 18,
                padding: 18,
                border: `1px solid ${publicTheme.softBorder}`,
                boxShadow: publicTheme.lightShadow,
                height: '100%',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
              }}
            >
              <div style={{ fontSize: 22, color: publicTheme.primary, marginTop: 2 }}>{item.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: publicTheme.text, marginBottom: 2 }}>
                  {item.title}
                </div>
                <div style={{ fontSize: 11, color: publicTheme.subtext, lineHeight: 1.45 }}>
                  {item.text}
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
}
