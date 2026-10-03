import React from 'react';
import { Layout, Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { buildModulePath, getDefaultMenuKey } from '../../data/erpModules';
import ErpModuleSidebar from '../../components/web/shared/ErpModuleSidebar';
import { useAdminTheme } from '../../hooks/useAdminTheme';
import AuraLogo from '../../components/common/AuraLogo';

const { Sider } = Layout;
const { Title } = Typography;

const HeaderDefault = ({ collapsed, setCollapsed, onMenuClick }) => {
  const adminTheme = useAdminTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  
  // Active module and menu detection
  let activeModuleKey = null;
  let activeMenuKey = null;

  if (location.pathname === '/admins' || location.pathname === '/admins/') {
    // Default to first module or null for dashboard
    activeModuleKey = searchParams.get('module') || null;
  } else if (location.pathname === '/admins/dashboard') {
    activeModuleKey = searchParams.get('module') || null;
  } else if (location.pathname.startsWith('/admins/products')) {
    activeModuleKey = 'inventory';
  } else if (location.pathname.startsWith('/admins/users')) {
    activeModuleKey = 'hr';
  } else if (location.pathname.startsWith('/admins/reports')) {
    activeModuleKey = 'reports';
  } else if (location.pathname.startsWith('/admins/settings')) {
    activeModuleKey = 'settings';
  } else if (location.pathname.startsWith('/admins/modules')) {
    activeModuleKey = 'settings';
    activeMenuKey = 'module-settings';
  } else if (location.pathname.startsWith('/admins/branches') || location.pathname.startsWith('/admins/settings/branches')) {
    activeModuleKey = 'settings';
    activeMenuKey = 'branches';
  } else if (location.pathname.startsWith('/admins/billers') || location.pathname.startsWith('/admins/settings/billers')) {
    activeModuleKey = 'settings';
    activeMenuKey = 'billers';
  } else if (location.pathname.startsWith('/admins/qrcode') || location.pathname.startsWith('/admins/qr-generator')) {
    activeModuleKey = 'cms';
  }

  // Detect active menu if not already set
  if (!activeMenuKey) {
    if (location.pathname.startsWith('/admins/qrcode') || location.pathname.startsWith('/admins/qr-generator')) {
      activeMenuKey = 'cms-qrcode';
    } else if (location.pathname === '/admins' || location.pathname === '/admins/') {
      activeMenuKey = searchParams.get('menu') || (activeModuleKey ? getDefaultMenuKey(activeModuleKey) : null);
    } else if (location.pathname === '/admins/dashboard') {
      activeMenuKey = searchParams.get('menu') || (activeModuleKey ? getDefaultMenuKey(activeModuleKey) : null);
    } else if (location.pathname.startsWith('/admins/settings')) {
      // Extract the menu key from the URL path
      const pathParts = location.pathname.split('/');
      const lastPart = pathParts[pathParts.length - 1];
      // Map URL segments to menu keys
      if (lastPart === 'categories') {
        activeMenuKey = 'categories';
      } else if (lastPart === 'users') {
        activeMenuKey = 'users';
      } else if (lastPart === 'system') {
        activeMenuKey = 'system-settings';
      } else if (lastPart === 'modules') {
        activeMenuKey = 'module-settings';
      } else {
        activeMenuKey = 'system-settings'; // Default for settings
      }
    }
  }

  const handleNavigate = (moduleKey, menuKey) => {
    navigate(buildModulePath(moduleKey, menuKey));
    if (onMenuClick) {
      onMenuClick();
    }
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      breakpoint="lg"
      collapsedWidth={94}
      width={280}
      trigger={null}
      style={{
        background: adminTheme.sidebar,
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRight: `1px solid ${adminTheme.sidebarBorder}`,
        padding: collapsed ? '14px 10px' : '14px 12px',
      }}
    >
      <div
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: collapsed ? '6px 2px' : '6px 8px',
          minHeight: 44,
          marginBottom: 16,
        }}
        onClick={() => navigate('/admins')}
      >
        <AuraLogo
          size={32}
          showText={!collapsed}
          subtitle="ERP COMMAND"
          textColor={adminTheme.text}
        />
      </div>

      <div style={{ flexGrow: 1, overflowY: 'auto' }}>
        <ErpModuleSidebar
          collapsed={collapsed}
          activeModuleKey={activeModuleKey}
          activeMenuKey={activeMenuKey}
          onNavigate={handleNavigate}
        />
      </div>
    </Sider>
  );
};

export default HeaderDefault;