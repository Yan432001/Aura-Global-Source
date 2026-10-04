import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Avatar, Badge, Button, Dropdown, Flex, Input, Layout, Tooltip, Typography, Modal, Tag, List } from 'antd';
import {
  BellOutlined,
  ExpandOutlined,
  LogoutOutlined,
  MenuOutlined,
  MoonOutlined,
  SearchOutlined,
  SettingOutlined,
  SunOutlined,
  UserOutlined,
  ControlOutlined,
  ShopOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  QrcodeOutlined,
  ArrowRightOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeSettings from '../../contexts/ThemeSettings';
import { getModuleByKey, erpModules } from '../../data/erpModules';
import { useAdminTheme } from '../../hooks/useAdminTheme';
import simpleData from '../../../data/simpleData';
import OfflineWarningBanner from '../../components/common/OfflineWarningBanner';

const { Header } = Layout;
const { Text, Title } = Typography;

const pageTitles = {
  '/admins/dashboard': 'Command Center',
  '/admins/products': 'Inventory Control',
  '/admins/users': 'Access Control',
  '/admins/orders': 'Orders Management',
  '/admins/qrcode': 'Store QR Code Generator',
  '/admins/qr-generator': 'Store QR Code Generator',
  '/admins/modules': 'ERP Modules Switchboard',
  '/admins/branches': 'Branches & Stores',
  '/admins/settings/branches': 'Branches & Stores',
};

const Head = ({ collapsed, setCollapsed, isMobile, showModuleMenu }) => {
  const adminTheme = useAdminTheme();
  const iconButtonStyle = { width: 40, height: 40, borderRadius: 12, color: adminTheme.subtext };
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { themeMode, toggleThemeMode } = useTheme();

  // Search state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('all');
  const searchInputRef = useRef(null);

  // Global CTRL + / listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 150);
    } else {
      setSearchQuery('');
    }
  }, [searchOpen]);

  // Search indexing
  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      // Default quick suggestions
      return [
        { type: 'module', title: 'Dashboard', desc: 'Main ERP KPI Overview', path: '/admins/dashboard', icon: <AppstoreOutlined /> },
        { type: 'module', title: 'Front End & Storefront', desc: 'Display concepts & multi-store manager', path: '/admins?module=front-end&menu=shop-settings', icon: <ShopOutlined /> },
        { type: 'module', title: 'Orders Management', desc: 'Live customer orders & Recharts analytics', path: '/admins/orders', icon: <FileTextOutlined /> },
        { type: 'module', title: 'Products & Inventory', desc: 'Manage catalog items & stock', path: '/admins/products', icon: <ShoppingOutlined /> },
        { type: 'module', title: 'Branches & Stores', desc: 'Manage store branches & POS registers', path: '/admins/settings/branches', icon: <ShopOutlined /> },
        { type: 'module', title: 'QR Code Generator', desc: 'Printable store table QR codes', path: '/admins/qrcode', icon: <QrcodeOutlined /> },
        { type: 'module', title: 'Modules Switchboard', desc: 'Open / close ERP modules', path: '/admins/modules', icon: <ControlOutlined /> },
      ];
    }

    const list = [];

    // 1. Search Modules & Menus
    erpModules.forEach((mod) => {
      if (mod.label.toLowerCase().includes(q) || (mod.description || '').toLowerCase().includes(q)) {
        list.push({
          type: 'module',
          title: mod.label,
          desc: mod.description,
          path: `/admins?module=${mod.key}`,
          icon: <AppstoreOutlined />,
        });
      }
      (mod.menus || []).forEach((m) => {
        if (m.type === 'group') {
          (m.children || []).forEach((leaf) => {
            if (leaf.label.toLowerCase().includes(q) || (leaf.description || '').toLowerCase().includes(q)) {
              list.push({
                type: 'module',
                title: `${mod.label} › ${leaf.label}`,
                desc: leaf.description,
                path: leaf.route || `/admins?module=${mod.key}&menu=${leaf.key}`,
                icon: <SettingOutlined />,
              });
            }
          });
        } else if (m.label?.toLowerCase().includes(q)) {
          list.push({
            type: 'module',
            title: `${mod.label} › ${m.label}`,
            desc: m.description,
            path: m.route || `/admins?module=${mod.key}&menu=${m.key}`,
            icon: <SettingOutlined />,
          });
        }
      });
    });

    // 2. Search Stores
    (simpleData.stores || []).forEach((store) => {
      if (
        store.name.toLowerCase().includes(q) ||
        (store.slug || '').toLowerCase().includes(q) ||
        (store.tagline || '').toLowerCase().includes(q) ||
        (store.address || '').toLowerCase().includes(q)
      ) {
        list.push({
          type: 'store',
          title: store.name,
          desc: `${store.tagline || 'Store'} • /${store.slug}`,
          path: `/admins?module=front-end&menu=shop-settings`,
          icon: <ShopOutlined />,
          tag: 'Storefront',
        });
      }
    });

    // 3. Search Products
    (simpleData.products || []).forEach((prod) => {
      if (
        prod.name.toLowerCase().includes(q) ||
        (prod.details || '').toLowerCase().includes(q) ||
        (prod.category || '').toLowerCase().includes(q)
      ) {
        list.push({
          type: 'product',
          title: prod.name,
          desc: `${prod.category} • $${Number(prod.price).toFixed(2)}`,
          path: `/admins/products`,
          icon: <ShoppingOutlined />,
          tag: `$${Number(prod.price).toFixed(2)}`,
        });
      }
    });

    // Filter by category tab
    if (searchCategory !== 'all') {
      return list.filter((item) => item.type === searchCategory);
    }

    return list.slice(0, 15);
  }, [searchQuery, searchCategory]);

  const handleSelectResult = (item) => {
    setSearchOpen(false);
    navigate(item.path);
  };

  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: 'Profile' },
    { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', danger: true, onClick: logout },
  ];

  const currentTitle = pageTitles[location.pathname] || 'ERP Workspace';
  const dashboardModuleKey = new URLSearchParams(location.search).get('module');
  const headerTitle =
    location.pathname === '/admins/dashboard' && dashboardModuleKey
      ? `${getModuleByKey(dashboardModuleKey).label} Controller`
      : currentTitle;

  const firstName = user?.name?.split(' ')[0] || 'Admin';
  const greeting =
    location.pathname === '/admins/dashboard'
      ? `Good ${new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}`
      : headerTitle;

  const handleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen?.();
    }
  };

  return (
    <>
      <OfflineWarningBanner />
      <Header
        style={{
          background: adminTheme.topPanel,
          padding: isMobile ? '12px 12px' : '16px 24px',
          height: 'auto',
          lineHeight: 'normal',
          borderBottom: `1px solid ${adminTheme.border}`,
        }}
      >
      <Flex justify="space-between" align="center" gap={16} wrap="wrap">
        <Flex align="center" gap={14}>
          {showModuleMenu && (
            <Tooltip title={isMobile ? 'Open menu' : collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
              <Button
                type="text"
                icon={<MenuOutlined style={{ fontSize: 18 }} />}
                onClick={setCollapsed}
                style={{ ...iconButtonStyle, background: adminTheme.cardMuted }}
              />
            </Tooltip>
          )}

          <Title level={4} style={{ margin: 0, color: adminTheme.text, whiteSpace: 'nowrap' }}>
            {greeting}
          </Title>
        </Flex>

        {!isMobile && (
          <div
            onClick={() => setSearchOpen(true)}
            style={{
              flex: 1,
              maxWidth: 380,
              height: 40,
              borderRadius: 10,
              background: adminTheme.cardMuted,
              border: `1px solid ${adminTheme.border}`,
              display: 'flex',
              alignItems: 'center',
              padding: '0 12px',
              cursor: 'pointer',
              gap: 8,
              transition: 'border-color 0.2s ease',
            }}
            className="hover:border-blue-400"
          >
            <SearchOutlined style={{ color: adminTheme.subtext, fontSize: 14 }} />
            <span style={{ color: adminTheme.subtext, fontSize: 13, flex: 1 }}>
              Search in Aura ERP (modules, stores, items)...
            </span>
            <Text
              style={{
                color: adminTheme.subtext,
                fontSize: 10.5,
                border: `1px solid ${adminTheme.border}`,
                borderRadius: 6,
                padding: '1px 6px',
                fontFamily: 'monospace',
                fontWeight: 600,
              }}
            >
              CTRL + /
            </Text>
          </div>
        )}

        <Flex align="center" gap={8} wrap="wrap">
          {isMobile && (
            <Button
              type="text"
              icon={<SearchOutlined style={{ fontSize: 16 }} />}
              onClick={() => setSearchOpen(true)}
              style={iconButtonStyle}
            />
          )}

          {!isMobile && (
            <Tooltip title="Fullscreen">
              <Button type="text" icon={<ExpandOutlined style={{ fontSize: 16 }} />} onClick={handleFullscreen} style={iconButtonStyle} />
            </Tooltip>
          )}

          <Tooltip title={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            <Button
              type="text"
              icon={themeMode === 'dark' ? <SunOutlined style={{ fontSize: 16 }} /> : <MoonOutlined style={{ fontSize: 16 }} />}
              onClick={toggleThemeMode}
              style={iconButtonStyle}
            />
          </Tooltip>

          <ThemeSettings />

          <Tooltip title="ERP Modules Switchboard (Open/Close Modules)">
            <Button
              type="text"
              icon={<ControlOutlined style={{ fontSize: 16 }} />}
              onClick={() => navigate('/admins/modules')}
              style={iconButtonStyle}
            />
          </Tooltip>

          <Badge count={5} size="small" offset={[-4, 4]}>
            <Button
              type="text"
              icon={<BellOutlined style={{ fontSize: 16 }} />}
              style={iconButtonStyle}
            />
          </Badge>

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
            <Flex align="center" gap={8} style={{ cursor: 'pointer', paddingLeft: 6 }}>
              <Avatar
                size={38}
                icon={<UserOutlined />}
                style={{ background: 'linear-gradient(135deg, #f4762a, #ff9f5a)' }}
              />
              {!isMobile && (
                <div>
                  <Text strong style={{ display: 'block', fontSize: 13, color: adminTheme.text, lineHeight: 1.2 }}>
                    {user?.name || 'Admin User'}
                  </Text>
                  <Text style={{ fontSize: 11, color: adminTheme.subtext }}>Super Admin</Text>
                </div>
              )}
            </Flex>
          </Dropdown>
        </Flex>
      </Flex>
    </Header>

    {/* Global Spotlight / Command Palette Search Modal */}
    <Modal
      open={searchOpen}
      onCancel={() => setSearchOpen(false)}
      footer={null}
      closable={false}
      width={620}
      style={{ top: 80 }}
      styles={{
        content: {
          padding: 0,
          borderRadius: 16,
          overflow: 'hidden',
          background: adminTheme.card,
          border: `1px solid ${adminTheme.border}`,
          boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
        },
      }}
    >
      <div style={{ padding: '14px 18px', borderBottom: `1px solid ${adminTheme.border}` }}>
        <Input
          ref={searchInputRef}
          prefix={<SearchOutlined style={{ fontSize: 18, color: '#2563eb', marginRight: 6 }} />}
          placeholder="Search all in ERP (modules, pages, stores, products, settings)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="borderless"
          style={{ fontSize: 15, padding: '4px 0' }}
          allowClear
        />
      </div>

      {/* Category Filter Chips */}
      <div style={{ padding: '10px 18px', background: adminTheme.cardMuted, display: 'flex', gap: 6, borderBottom: `1px solid ${adminTheme.border}` }}>
        {[
          { key: 'all', label: 'All Results' },
          { key: 'module', label: 'ERP Modules' },
          { key: 'store', label: 'Stores & Shops' },
          { key: 'product', label: 'Products & Menu' },
        ].map((cat) => (
          <Tag
            key={cat.key}
            color={searchCategory === cat.key ? 'blue' : 'default'}
            onClick={() => setSearchCategory(cat.key)}
            style={{
              cursor: 'pointer',
              borderRadius: 6,
              padding: '2px 10px',
              fontWeight: searchCategory === cat.key ? 700 : 500,
            }}
          >
            {cat.label}
          </Tag>
        ))}
      </div>

      {/* Results List */}
      <div style={{ maxHeight: 380, overflowY: 'auto', padding: '8px 12px' }}>
        {searchResults.length === 0 ? (
          <div style={{ padding: '32px 16px', textAlign: 'center', color: adminTheme.subtext }}>
            <SearchOutlined style={{ fontSize: 24, marginBottom: 8, opacity: 0.5 }} />
            <div>No results matching "{searchQuery}"</div>
            <div style={{ fontSize: 11, marginTop: 4 }}>Try searching for "POS", "coffee", "store", "orders", or "users"</div>
          </div>
        ) : (
          <List
            dataSource={searchResults}
            renderItem={(item) => (
              <List.Item
                onClick={() => handleSelectResult(item)}
                style={{
                  padding: '10px 14px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                className="hover:bg-blue-50 dark:hover:bg-slate-800"
              >
                <Flex align="center" gap={12}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: '#2563eb14',
                      color: '#2563eb',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: 16,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <Text strong style={{ fontSize: 13, color: adminTheme.text }}>
                      {item.title}
                    </Text>
                    <Text style={{ fontSize: 11, color: adminTheme.subtext, display: 'block' }}>
                      {item.desc}
                    </Text>
                  </div>
                </Flex>

                <Flex align="center" gap={8}>
                  {item.tag && <Tag color="cyan" style={{ borderRadius: 6, fontSize: 10.5 }}>{item.tag}</Tag>}
                  <ArrowRightOutlined style={{ fontSize: 12, color: adminTheme.subtext }} />
                </Flex>
              </List.Item>
            )}
          />
        )}
      </div>

      {/* Footer shortcuts info */}
      <div
        style={{
          padding: '8px 16px',
          background: adminTheme.cardMuted,
          borderTop: `1px solid ${adminTheme.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 11,
          color: adminTheme.subtext,
        }}
      >
        <span>Use <b>↑</b> <b>↓</b> to navigate, <b>ESC</b> to close</span>
        <span><b>CTRL + /</b> to toggle search</span>
      </div>
    </Modal>
    </>
  );
};

export default Head;
