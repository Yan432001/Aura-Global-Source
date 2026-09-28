import React from 'react';
import { Layout, Grid } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCartOutlined } from '@ant-design/icons';
import Header from '../components/web/common/Header';
import Footer from '../components/web/common/Footer';
import MobileBottomNav from '../components/web/common/MobileBottomNav';
import { useCart } from '../contexts/CartContext';
import { publicTheme } from '../utils/webTheme';

const { Content } = Layout;
const { useBreakpoint } = Grid;

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const { cartItemCount, cartTotal } = useCart();
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
            padding: screens.xs ? '10px 8px 80px' : screens.lg ? '20px 28px 56px' : '14px 16px 40px',
            boxSizing: 'border-box',
          }}
        >
          <Outlet />
        </div>
      </Content>

      <Footer />

      {/* Fixed Mobile Bottom Navigation for Phone Screens */}
      <MobileBottomNav />

      {/* Floating Cart Indicator for Tablet & Desktop when browsing with items */}
      {cartItemCount > 0 && currentPage !== '/cart' && !screens.xs && (
        <button
          type="button"
          onClick={() => navigate('/cart')}
          aria-label="View Cart"
          style={{
            position: 'fixed',
            bottom: 28,
            right: 28,
            zIndex: 1050,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 999,
            padding: '12px 22px',
            boxShadow: '0 12px 30px rgba(37, 99, 235, 0.4), 0 4px 10px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            fontWeight: 800,
            fontSize: 14,
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
          }}
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <ShoppingCartOutlined style={{ fontSize: 18 }} />
            <span
              style={{
                position: 'absolute',
                top: -8,
                right: -10,
                background: '#ef4444',
                color: '#ffffff',
                fontSize: 10,
                fontWeight: 900,
                borderRadius: 999,
                padding: '1px 5px',
                minWidth: 16,
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              {cartItemCount}
            </span>
          </div>
          <span>View Cart</span>
          <span style={{ opacity: 0.6, fontWeight: 700 }}>•</span>
          <span>${cartTotal.toFixed(2)}</span>
        </button>
      )}
    </Layout>
  );
};

export default MainLayout;
