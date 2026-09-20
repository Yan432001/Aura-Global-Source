import React from 'react';
import { Layout, Typography, Space, Divider } from "antd";
import { useTheme } from '../../contexts/ThemeContext';

const { Footer } = Layout;
const { Text, Link } = Typography;

const FooterDefault = () => {
  const { themeMode, customSettings } = useTheme();
  
  const footerStyle = {
    textAlign: 'center',
    padding: '20px 24px',
    background: themeMode === 'dark' ? '#141414' : '#fafafa',
    borderTop: `1px solid ${themeMode === 'dark' ? '#424242' : '#f0f0f0'}`,
    boxShadow: themeMode === 'dark' ? '0 -2px 8px rgba(0,0,0,0.15)' : '0 -2px 8px rgba(0,0,0,0.05)',
    fontFamily: customSettings.fontFamily,
  };

  return (
    <Footer style={footerStyle}>
      <Space split={<Divider type="vertical" style={{ borderColor: themeMode === 'dark' ? '#424242' : '#d9d9d9' }} />} size={12} wrap>
        <Text style={{ fontSize: 12.5, color: themeMode === 'dark' ? 'rgba(255,255,255,0.55)' : '#8a94a6' }}>
          2014-2026 © Aura ERP
        </Text>
        <Link href="/privacy" style={{ fontSize: 12.5, color: themeMode === 'dark' ? '#1890ff' : '#8a94a6' }}>
          Privacy Policy
        </Link>
        <Link href="/terms" style={{ fontSize: 12.5, color: themeMode === 'dark' ? '#1890ff' : '#8a94a6' }}>
          Terms of Service
        </Link>
        <Link href="/support" style={{ fontSize: 12.5, color: themeMode === 'dark' ? '#1890ff' : '#8a94a6' }}>
          Support
        </Link>
      </Space>
    </Footer>
  );
};

export default FooterDefault;