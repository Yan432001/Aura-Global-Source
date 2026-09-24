import React from 'react';
import { Layout, Grid } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/web/common/Header';
import Footer from '../components/web/common/Footer';
import { publicTheme } from '../utils/webTheme';

const { Content } = Layout;
const { useBreakpoint } = Grid;

const MainLayout = () => {
  const location = useLocation();
  const screens = useBreakpoint();
  const currentPage = location.pathname;

  return (
    <Layout
      style={{
        minHeight: '100vh',
        background: publicTheme.pageBackground,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(circle at 8% 18%, rgba(20,92,114,0.14), transparent 18%), radial-gradient(circle at 94% 12%, rgba(47,143,118,0.12), transparent 16%)',
        }}
      />

      <Layout.Header
        style={{
          padding: 0,
          background: 'transparent',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          height: 'auto',
          lineHeight: 'normal',
        }}
      >
        <Header currentPage={currentPage} />
      </Layout.Header>

      <Content style={{ flex: 1, position: 'relative', zIndex: 1, width: '100%' }}>
        <div
          style={{
            width: '100%',
            minHeight: 'calc(100vh - 84px - 180px)',
            padding: screens.xs ? '16px 12px 40px' : '20px 28px 56px',
            boxSizing: 'border-box',
          }}
        >
          <Outlet />
        </div>
      </Content>

      <Footer />
    </Layout>
  );
};

export default MainLayout;
