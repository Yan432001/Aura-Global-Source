import React, { useMemo, useState } from 'react';
import { Avatar, Badge, Button, Drawer, Flex, Grid, Input, Row, Col, Dropdown, Space, Typography } from 'antd';
import {
  AppstoreOutlined,
  BookOutlined,
  GlobalOutlined,
  HeartOutlined,
  HomeOutlined,
  MenuOutlined,
  SearchOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';
import { useWishlist } from '../../../contexts/WishlistContext';
import { useAuth } from '../../../contexts/AuthContext';
import { publicTheme } from '../../../utils/webTheme';

const { useBreakpoint } = Grid;
const { Text, Title } = Typography;

const Header = ({ currentPage }) => {
  const { cartItemCount } = useCart();
  const { wishlistItemCount } = useWishlist();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);

  const isMobile = !screens.md;

  const navItems = useMemo(
    () => [
      { key: '/', icon: <HomeOutlined />, label: 'Home' },
      { key: '/shop', icon: <ShopOutlined />, label: 'Shops' },
      { key: '/products', icon: <AppstoreOutlined />, label: 'Products' },
      { key: '/service', icon: <TeamOutlined />, label: 'Service' },
      { key: '/learn', icon: <BookOutlined />, label: 'Learn' },
    ],
    []
  );

  const quickLinks = [
    { key: '/wishlist', icon: <HeartOutlined />, label: 'Wishlist' },
    { key: '/cart', icon: <ShoppingCartOutlined />, label: 'Orders' },
    { key: '/profile', icon: <UserOutlined />, label: 'Account' },
    { key: '/admins/dashboard', icon: <GlobalOutlined />, label: 'Admin Portal' },
  ];

  const mobileShortcuts = [
    { key: '/shop', icon: <ShopOutlined />, label: 'Shops' },
    { key: '/products', icon: <AppstoreOutlined />, label: 'Products' },
    { key: '/service', icon: <TeamOutlined />, label: 'Support' },
  ];

  const handleMenuClick = ({ key }) => {
    switch (key) {
      case 'profile':
        navigate('/profile');
        break;
      case 'login':
        navigate('/login');
        break;
      case 'signup':
        navigate('/login');
        break;
      case 'logout':
        logout();
        navigate('/');
        break;
      default:
        break;
    }
    setDrawerVisible(false);
  };

  const userMenuItems = [
    ...(user ? [{ key: 'profile', label: 'My Profile' }] : [{ key: 'login', label: 'Login' }]),
    user ? { key: 'logout', label: 'Logout' } : { key: 'signup', label: 'Sign Up' },
  ];

  const renderNavLink = (item) => {
    const active = currentPage === item.key || (item.key !== '/' && currentPage.startsWith(item.key));

    return (
      <Link
        key={item.key}
        to={item.key}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 16px',
          borderRadius: 999,
          color: active ? publicTheme.primary : publicTheme.text,
          background: active ? publicTheme.pill : 'transparent',
          fontWeight: active ? 700 : 500,
          fontSize: 13,
        }}
      >
        {item.icon}
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      <div style={{ padding: isMobile ? '12px 12px 0' : '14px 16px 0' }}>
        <div
          className="frosted-panel"
          style={{
            padding: isMobile ? '14px' : '14px 18px',
            borderRadius: isMobile ? 24 : 28,
            background: 'rgba(255,255,255,0.88)',
            border: `1px solid ${publicTheme.border}`,
            boxShadow: publicTheme.shadow,
          }}
        >
          {isMobile ? (
            <Space direction="vertical" size={14} style={{ width: '100%' }}>
              <Flex justify="space-between" align="center" gap={12}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 18,
                      background: publicTheme.ribbon,
                      boxShadow: '0 14px 28px rgba(47, 111, 237, 0.22)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 800,
                      fontSize: 16,
                      flexShrink: 0,
                    }}
                  >
                    AS
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <Title level={5} style={{ margin: 0, color: publicTheme.text }}>
                      Aura Supply
                    </Title>
                    <Text style={{ fontSize: 12, color: publicTheme.subtext }}>
                      Shops, products, support
                    </Text>
                  </div>
                </Link>

                <Space size={8}>
                  <Badge count={wishlistItemCount} size="small">
                    <Button
                      icon={<HeartOutlined />}
                      onClick={() => navigate('/wishlist')}
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 16,
                        background: publicTheme.cardMuted,
                        border: `1px solid ${publicTheme.softBorder}`,
                      }}
                    />
                  </Badge>

                  <Badge count={cartItemCount} size="small">
                    <Button
                      data-cart-target="true"
                      icon={<ShoppingCartOutlined />}
                      onClick={() => navigate('/cart')}
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 16,
                        background: publicTheme.cardMuted,
                        border: `1px solid ${publicTheme.softBorder}`,
                      }}
                    />
                  </Badge>

                  <Button
                    type="text"
                    icon={<MenuOutlined />}
                    onClick={() => setDrawerVisible(true)}
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 16,
                      background: publicTheme.cardMuted,
                      border: `1px solid ${publicTheme.softBorder}`,
                    }}
                  />
                </Space>
              </Flex>

              <button
                type="button"
                onClick={() => setSearchVisible(true)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '14px 16px',
                  borderRadius: 18,
                  border: `1px solid ${publicTheme.softBorder}`,
                  background: 'linear-gradient(135deg, rgba(244,248,245,0.96), rgba(255,255,255,0.98))',
                  color: publicTheme.subtext,
                  fontSize: 14,
                  fontFamily: 'inherit',
                  textAlign: 'left',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.88)',
                }}
              >
                <SearchOutlined style={{ color: publicTheme.primary, fontSize: 16 }} />
                <span style={{ flex: 1 }}>Search shops, products, support, and courses</span>
              </button>

              <Row gutter={[10, 10]}>
                {mobileShortcuts.map((item) => {
                  const active =
                    currentPage === item.key || (item.key !== '/' && currentPage.startsWith(item.key));

                  return (
                    <Col span={8} key={item.key}>
                      <Button
                        block
                        icon={item.icon}
                        onClick={() => navigate(item.key)}
                        style={{
                          height: 54,
                          borderRadius: 18,
                          background: active ? publicTheme.ribbon : publicTheme.cardMuted,
                          color: active ? 'white' : publicTheme.text,
                          border: active ? 'none' : `1px solid ${publicTheme.softBorder}`,
                          fontWeight: 700,
                          boxShadow: active ? '0 12px 28px rgba(47, 111, 237, 0.18)' : 'none',
                        }}
                      >
                        {item.label}
                      </Button>
                    </Col>
                  );
                })}
              </Row>
            </Space>
          ) : (
            <Row align="middle" justify="space-between" gutter={[12, 12]}>
              <Col xs={14} md={6} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 16,
                      background: publicTheme.ribbon,
                      boxShadow: '0 12px 30px rgba(47, 111, 237, 0.24)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: 16,
                    }}
                  >
                    AS
                  </div>
                  <div>
                    <Title level={5} style={{ margin: 0, color: publicTheme.text, fontFamily: '"Aptos", "Segoe UI", sans-serif' }}>
                      Aura Supply
                    </Title>
                    <Text style={{ fontSize: 12, color: publicTheme.subtext }}>
                      B2B sourcing, service, and learning
                    </Text>
                  </div>
                </Link>
              </Col>

              <Col md={9} lg={8} style={{ display: 'flex', justifyContent: 'center' }}>
                <Flex
                  align="center"
                  gap={6}
                  style={{
                    padding: 6,
                    borderRadius: 999,
                    background: publicTheme.cardMuted,
                    border: `1px solid ${publicTheme.softBorder}`,
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                  }}
                >
                  {navItems.map((item) => renderNavLink(item))}
                </Flex>
              </Col>

              <Col xs={10} md={9} lg={10}>
                <Flex justify="flex-end" align="center" gap={10} wrap="wrap">
                  <Input
                    placeholder="Search shops, products, or courses"
                    prefix={<SearchOutlined style={{ color: publicTheme.subtext }} />}
                    style={{
                      width: screens.lg ? 290 : 220,
                      height: 42,
                      borderRadius: 999,
                      background: publicTheme.cardMuted,
                      border: `1px solid ${publicTheme.softBorder}`,
                    }}
                  />

                  {screens.lg && (
                    <Button
                      icon={<ThunderboltOutlined />}
                      onClick={() => navigate('/admins/dashboard')}
                      style={{
                        height: 42,
                        borderRadius: 999,
                        paddingInline: 18,
                        background: publicTheme.ribbon,
                        border: 'none',
                        color: 'white',
                        fontWeight: 700,
                      }}
                    >
                      Operations Portal
                    </Button>
                  )}

                  <Badge count={wishlistItemCount} size="small">
                    <Button
                      icon={<HeartOutlined />}
                      onClick={() => navigate('/wishlist')}
                      style={{
                        height: 42,
                        borderRadius: 16,
                        background: publicTheme.cardMuted,
                        border: `1px solid ${publicTheme.softBorder}`,
                      }}
                    />
                  </Badge>

                  <Badge count={cartItemCount} size="small">
                    <Button
                      data-cart-target="true"
                      icon={<ShoppingCartOutlined />}
                      onClick={() => navigate('/cart')}
                      style={{
                        height: 42,
                        borderRadius: 16,
                        background: publicTheme.cardMuted,
                        border: `1px solid ${publicTheme.softBorder}`,
                      }}
                    />
                  </Badge>

                  <Dropdown
                    menu={{
                      items: userMenuItems,
                      onClick: handleMenuClick,
                    }}
                    placement="bottomRight"
                    trigger={['click']}
                  >
                    <Button
                      style={{
                        height: 42,
                        borderRadius: 16,
                        paddingInline: 10,
                        background: publicTheme.cardMuted,
                        border: `1px solid ${publicTheme.softBorder}`,
                      }}
                    >
                      <Space>
                        <Avatar icon={<UserOutlined />} size={28} style={{ background: publicTheme.primary }} />
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: publicTheme.text }}>
                            {user ? user.name : 'Guest'}
                          </div>
                          <div style={{ fontSize: 11, color: publicTheme.subtext }}>
                            {user ? 'Workspace ready' : 'Sign in to track orders'}
                          </div>
                        </div>
                      </Space>
                    </Button>
                  </Dropdown>
                </Flex>
              </Col>
            </Row>
          )}
        </div>
      </div>

      <Drawer
        title="Search Workspace"
        placement="top"
        onClose={() => setSearchVisible(false)}
        open={searchVisible}
        height={isMobile ? 180 : 140}
        styles={{ body: { padding: 16 } }}
      >
        <Space.Compact style={{ width: '100%' }}>
          <Input
            placeholder="Search shops, products, support, and learning"
            size="large"
            autoFocus
          />
          <Button type="primary" icon={<SearchOutlined />} size="large" style={{ background: publicTheme.ribbon, border: 'none' }} />
        </Space.Compact>
        {isMobile && (
          <Space wrap style={{ marginTop: 14 }}>
            {mobileShortcuts.map((item) => (
              <Button key={item.key} onClick={() => {
                navigate(item.key);
                setSearchVisible(false);
              }} style={{ borderRadius: 999 }}>
                {item.label}
              </Button>
            ))}
          </Space>
        )}
      </Drawer>

      <Drawer
        title={
          <Space>
            <Avatar icon={<UserOutlined />} size={32} style={{ background: publicTheme.primary }} />
            <span>{user ? `${user.name}'s workspace` : 'Guest workspace'}</span>
          </Space>
        }
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        styles={{
          body: { padding: 20 },
          header: { padding: '16px 20px' },
        }}
        width={300}
      >
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          {navItems.map((item) => (
            <Button
              key={item.key}
              block
              onClick={() => {
                navigate(item.key);
                setDrawerVisible(false);
              }}
              style={{
                height: 50,
                borderRadius: 16,
                justifyContent: 'flex-start',
                background:
                  currentPage === item.key || (item.key !== '/' && currentPage.startsWith(item.key))
                    ? publicTheme.pill
                    : publicTheme.cardMuted,
                border: `1px solid ${publicTheme.softBorder}`,
                color: publicTheme.text,
                fontWeight: 600,
              }}
              icon={item.icon}
            >
              {item.label}
            </Button>
          ))}
        </Space>

        <div style={{ marginTop: 18, paddingTop: 18, borderTop: `1px solid ${publicTheme.softBorder}` }}>
          <Text style={{ display: 'block', marginBottom: 10, color: publicTheme.subtext, fontSize: 12 }}>
            Quick access
          </Text>
          <Space direction="vertical" size={8} style={{ width: '100%' }}>
            {quickLinks.map((item) => (
              <Button
                key={item.key}
                block
                onClick={() => {
                  navigate(item.key);
                  setDrawerVisible(false);
                }}
                style={{
                  height: 48,
                  borderRadius: 16,
                  justifyContent: 'flex-start',
                  background: publicTheme.cardMuted,
                  border: `1px solid ${publicTheme.softBorder}`,
                  color: publicTheme.text,
                  fontWeight: 600,
                }}
                icon={item.icon}
              >
                {item.label}
              </Button>
            ))}
          </Space>
        </div>

        <div style={{ marginTop: 18, paddingTop: 18, borderTop: `1px solid ${publicTheme.softBorder}` }}>
          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: handleMenuClick,
            }}
            trigger={['click']}
          >
            <Button
              block
              style={{
                height: 50,
                borderRadius: 16,
                justifyContent: 'flex-start',
                background: publicTheme.cardMuted,
                border: `1px solid ${publicTheme.softBorder}`,
                color: publicTheme.text,
                fontWeight: 600,
              }}
            >
              <Space>
                <Avatar icon={<UserOutlined />} size={28} style={{ background: publicTheme.primary }} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: publicTheme.text }}>
                    {user ? user.name : 'Guest'}
                  </div>
                  <div style={{ fontSize: 11, color: publicTheme.subtext }}>
                    {user ? 'Workspace ready' : 'Tap to sign in'}
                  </div>
                </div>
              </Space>
            </Button>
          </Dropdown>
        </div>
      </Drawer>
    </>
  );
};

export default Header;
