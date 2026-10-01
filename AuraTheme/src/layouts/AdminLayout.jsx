import React, { useEffect, useState } from 'react';
import { Drawer, Layout } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import { NotificationProvider } from '../pages/admins/NotificationContext';
import HeaderDefault from '../pages/admins/AdminHeaderDefault';
import Head from '../pages/admins/AdminHead';
import FooterDefault from '../pages/admins/AdminFooterDefault';
import { erpModules } from '../data/erpModules';
import { useAdminTheme } from '../hooks/useAdminTheme';

const { Content } = Layout;
const MOBILE_BREAKPOINT = 992;
const MODULE_STATE_STORAGE_KEY = 'aura-admin-module-state';

// Routes that should NOT show the sidebar
const NO_SIDEBAR_ROUTES = [
  '/admins/login',
  '/admins/HorizontalGlassLogin',
  '/admins/MinimalistFloatingLogin',
  '/admins/GradientGlassLogin',
];

const AdminLayout = () => {
  const adminTheme = useAdminTheme();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [moduleState, setModuleState] = useState(() => {
    const defaultState = Object.fromEntries(erpModules.map((module) => [module.key, module.enabled]));

    try {
      const savedState = window.localStorage.getItem(MODULE_STATE_STORAGE_KEY);
      return savedState ? { ...defaultState, ...JSON.parse(savedState) } : defaultState;
    } catch {
      return defaultState;
    }
  });

  // Check if sidebar should be shown
  const showSidebar = location.pathname.startsWith('/admins') && 
    !NO_SIDEBAR_ROUTES.some(route => location.pathname.startsWith(route));

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);

      if (mobile) {
        setCollapsed(true);
      } else {
        setMobileDrawerOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(MODULE_STATE_STORAGE_KEY, JSON.stringify(moduleState));
  }, [moduleState]);

  const handleToggle = () => {
    if (isMobile) {
      setMobileDrawerOpen((previous) => !previous);
    } else {
      setCollapsed((previous) => !previous);
    }
  };

  const handleToggleModule = (moduleKey, enabled) => {
    setModuleState((previous) => ({
      ...previous,
      [moduleKey]: enabled,
    }));
  };

  const contentMarginLeft = !showSidebar ? 0 : isMobile ? 0 : collapsed ? 94 : 296;

  return (
    <NotificationProvider>
      <Layout
        style={{
          minHeight: '100vh',
          background: adminTheme.pageBackground,
        }}
      >
        {isMobile && showSidebar && (
          <Drawer
            placement="left"
            open={mobileDrawerOpen}
            closable={false}
            width={296}
            onClose={() => setMobileDrawerOpen(false)}
            styles={{
              body: { padding: 0, background: adminTheme.sidebar },
              header: { display: 'none' },
            }}
          >
            <HeaderDefault
              collapsed={false}
              setCollapsed={() => {}}
              onMenuClick={() => setMobileDrawerOpen(false)}
              moduleState={moduleState}
              onToggleModule={handleToggleModule}
            />
          </Drawer>
        )}

        {!isMobile && showSidebar && (
          <HeaderDefault
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            moduleState={moduleState}
            onToggleModule={handleToggleModule}
          />
        )}

        <Layout
          style={{
            marginLeft: contentMarginLeft,
            transition: 'all 0.24s ease',
            minHeight: '100vh',
            backgroundColor: 'transparent',
          }}
        >
          <Head
            collapsed={collapsed}
            setCollapsed={handleToggle}
            isMobile={isMobile}
            showModuleMenu={showSidebar}
          />

          <Content
            style={{
              margin: 0,
              padding: isMobile ? 16 : 24,
              background: 'transparent',
              minHeight: 'calc(100vh - 76px)',
            }}
          >
            <Outlet context={{ moduleState, onToggleModule: handleToggleModule }} />
          </Content>

          <FooterDefault />
        </Layout>
      </Layout>
    </NotificationProvider>
  );
};

export default AdminLayout;