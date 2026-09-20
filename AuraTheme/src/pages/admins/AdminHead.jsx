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
} from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeSettings from '../../contexts/ThemeSettings';
import { getModuleByKey } from '../../data/erpModules';
import { useAdminTheme } from '../../hooks/useAdminTheme';

const { Header } = Layout;
const { Text, Title } = Typography;

const pageTitles = {
  '/admins/dashboard': 'Command Center',
  '/admins/products': 'Inventory Control',
  '/admins/users': 'Access Control',
};

const Head = ({ collapsed, setCollapsed, isMobile, showModuleMenu }) => {
  const adminTheme = useAdminTheme();
  const iconButtonStyle = { width: 40, height: 40, borderRadius: 12, color: adminTheme.subtext };
  const location = useLocation();
  const { user, logout } = useAuth();
  const { themeMode, toggleThemeMode } = useTheme();

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
  );
};

export default Head;
