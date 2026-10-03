import React from 'react';
import { Avatar, Badge, Button, Dropdown, Flex, Input, Layout, Tooltip, Typography } from 'antd';
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
  DownOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeSettings from '../../contexts/ThemeSettings';
import { getModuleByKey } from '../../data/erpModules';
import { useAdminTheme } from '../../hooks/useAdminTheme';
import { useBranchesAndBillers } from '../../hooks/useBranchesAndBillers';
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
  '/admins/branches': 'Branches & Multiple Billers',
  '/admins/settings/branches': 'Branches & Multiple Billers',
  '/admins/billers': 'Multiple Billers Management',
  '/admins/settings/billers': 'Multiple Billers Management',
};

const Head = ({ collapsed, setCollapsed, isMobile, showModuleMenu }) => {
  const adminTheme = useAdminTheme();
  const iconButtonStyle = { width: 40, height: 40, borderRadius: 12, color: adminTheme.subtext };
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { themeMode, toggleThemeMode } = useTheme();
  const { branches, billers, activeBranch, setActiveBranchId } = useBranchesAndBillers();

  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: 'Profile' },
    { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', danger: true, onClick: logout },
  ];

  const branchMenuItems = [
    {
      key: 'header',
      type: 'group',
      label: 'Switch Store Branch & Biller Context',
    },
    ...branches.map((b) => {
      const linkedBiller = billers.find((bil) => bil.id === b.biller_id);
      const isSelected = activeBranch?.id === b.id;
      return {
        key: `branch-${b.id}`,
        icon: isSelected ? <CheckOutlined style={{ color: '#16a34a' }} /> : <ShopOutlined style={{ color: '#2563eb' }} />,
        label: (
          <div style={{ padding: '2px 0' }}>
            <div style={{ fontWeight: isSelected ? 700 : 500, color: isSelected ? '#2563eb' : undefined }}>
              {b.name}
            </div>
            <div style={{ fontSize: 11, color: adminTheme.subtext }}>
              Biller: {linkedBiller?.trading_name || linkedBiller?.company_name || 'Central'} &bull; {b.city}
            </div>
          </div>
        ),
        onClick: () => setActiveBranchId(b.id),
      };
    }),
    { type: 'divider' },
    {
      key: 'manage-branches',
      icon: <SettingOutlined />,
      label: <span style={{ fontWeight: 600 }}>Manage All Branches &amp; Billers</span>,
      onClick: () => navigate('/admins/settings/branches'),
    },
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
          <Input
            prefix={<SearchOutlined style={{ color: adminTheme.subtext }} />}
            suffix={
              <Text style={{ color: adminTheme.subtext, fontSize: 11, border: `1px solid ${adminTheme.border}`, borderRadius: 6, padding: '1px 6px' }}>
                CTRL + /
              </Text>
            }
            placeholder="Search in Aura ERP"
            style={{
              flex: 1,
              maxWidth: 380,
              height: 40,
              borderRadius: 10,
              background: adminTheme.cardMuted,
              border: `1px solid ${adminTheme.border}`,
            }}
          />
        )}

        <Flex align="center" gap={8} wrap="wrap">
          {/* Active Branch / Multiple Biller Context Dropdown */}
          <Dropdown menu={{ items: branchMenuItems }} trigger={['click']} placement="bottomRight">
            <Button
              style={{
                height: 40,
                borderRadius: 10,
                background: adminTheme.cardMuted,
                border: `1px solid ${adminTheme.border}`,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '0 12px',
                color: adminTheme.text,
              }}
            >
              <ShopOutlined style={{ color: '#2563eb', fontSize: 15 }} />
              <span style={{ fontWeight: 600, fontSize: 12.5, maxWidth: isMobile ? 120 : 180 }} className="truncate">
                {activeBranch?.name || 'Select Branch'}
              </span>
              <DownOutlined style={{ fontSize: 9, opacity: 0.6 }} />
            </Button>
          </Dropdown>

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
    </>
  );
};

export default Head;
