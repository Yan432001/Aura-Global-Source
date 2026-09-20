import React from 'react';
import { Layout, Row, Col, Grid } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/web/common/Header';
import Footer from '../components/web/common/Footer';
import Sidebar from '../components/web/common/Sidebar';
import { publicTheme } from '../utils/webTheme';

const { Content } = Layout;
const { useBreakpoint } = Grid;

const MainLayout = () => {
  const location = useLocation();
  const screens = useBreakpoint();
  const currentPage = location.pathname;
  const fullWidthRoutes = ['/shop', '/products', '/service'];

  const isFullWidthPage = fullWidthRoutes.some((route) => currentPage.startsWith(route));

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

      <Content style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        <Row
          gutter={[20, 20]}
          style={{
            minHeight: 'calc(100vh - 84px - 180px)',
            padding: screens.xs ? '20px 12px 44px' : '24px 24px 56px',
            width: '100%',
          }}
        >
          <Col xs={24} lg={isFullWidthPage ? 24 : 17}>
            <Outlet />
          </Col>

          {!isFullWidthPage && (
            <Col xs={24} lg={7}>
              <Sidebar />
            </Col>
          )}
        </Row>
      </Content>

      <Footer />
    </Layout>
  );
};

export default MainLayout;
