import React from 'react';
import { Row, Col, Card, Space, Tag, Button, Avatar, Divider, Flex, message } from 'antd';
import { Typography } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  SafetyCertificateOutlined,
  GiftOutlined,
  ShopOutlined,
  SendOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GoogleIcon, TelegramIcon } from '../../components/common/SocialAuthModal';

const { Title, Paragraph, Text } = Typography;

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    message.info('You have been signed out.');
    navigate('/login');
  };

  const displayName = user?.name || 'Aura Member';
  const displayEmail = user?.email || 'member@auraglobal.com';
  const isGoogle = user?.provider === 'google' || user?.googleVerified;
  const isTelegram = user?.provider === 'telegram' || user?.telegramVerified;
  const loyaltyPoints = user?.loyaltyPoints || 150;
  const memberTier = user?.tier || 'Gold VIP Member';

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '16px 20px 48px' }}>
      {/* Profile Header */}
      <div
        style={{
          background: isTelegram
            ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
            : isGoogle
            ? 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)'
            : 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
          padding: '40px 32px',
          textAlign: 'center',
          borderRadius: 24,
          color: 'white',
          marginBottom: 32,
          boxShadow: '0 20px 35px -10px rgba(37, 99, 235, 0.25)',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', top: 20, right: 20 }}>
          <Button
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ borderRadius: 10, background: 'rgba(255,255,255,0.9)', color: '#dc2626', fontWeight: 600, border: 'none' }}
          >
            Sign Out
          </Button>
        </div>

        <Avatar
          size={100}
          src={user?.avatar}
          icon={<UserOutlined />}
          style={{
            background: '#FFFFFF',
            marginBottom: 16,
            border: '4px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          }}
        />

        <Flex justify="center" align="center" gap={8} style={{ marginBottom: 4 }}>
          <Title level={2} style={{ fontSize: '28px', margin: 0, color: 'white', fontWeight: 800 }}>
            {displayName}
          </Title>
          {isGoogle && (
            <Tag color="#ffffff" style={{ color: '#1d4ed8', fontWeight: 700, borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 4, margin: 0 }}>
              <GoogleIcon size={14} /> Google Verified
            </Tag>
          )}
          {isTelegram && (
            <Tag color="#ffffff" style={{ color: '#0284c7', fontWeight: 700, borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 4, margin: 0 }}>
              <TelegramIcon size={14} /> Telegram Connected
            </Tag>
          )}
        </Flex>

        <Paragraph style={{ fontSize: '14px', margin: '0 0 12px', color: 'rgba(255,255,255,0.85)' }}>
          {displayEmail} {user?.username && `• ${user.username}`} &bull; {memberTier}
        </Paragraph>

        <div style={{ display: 'inline-flex', gap: 8, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '6px 16px' }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>🎁 {loyaltyPoints} Rewards Points Available</span>
        </div>
      </div>

      {/* Stats Overview */}
      <Row gutter={[20, 20]} style={{ marginBottom: 32 }}>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 18, textAlign: 'center', border: '1px solid #e2e8f0' }} styles={{ body: { padding: 18 } }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#2563eb' }}>{loyaltyPoints}</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>Aura Points</div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 18, textAlign: 'center', border: '1px solid #e2e8f0' }} styles={{ body: { padding: 18 } }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#16a34a' }}>5</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>Completed Orders</div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 18, textAlign: 'center', border: '1px solid #e2e8f0' }} styles={{ body: { padding: 18 } }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#d97706' }}>VIP</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>Membership Tier</div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: 18, textAlign: 'center', border: '1px solid #e2e8f0' }} styles={{ body: { padding: 18 } }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#7c3aed' }}>15%</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>Store Discount</div>
          </Card>
        </Col>
      </Row>

      {/* Badges and Settings Row */}
      <Row gutter={[20, 20]} style={{ marginBottom: 32 }}>
        <Col xs={24} md={12}>
          <Card style={{ borderRadius: 18, border: '1px solid #e2e8f0' }} title={<div style={{ fontSize: 15, fontWeight: 700 }}>🏆 Member Privileges</div>}>
            <Space direction="vertical" style={{ width: '100%' }} size={10}>
              <div style={{ padding: '10px 14px', borderRadius: 12, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>☕ Free Artisan Pour-Over Refill</span>
                <Tag color="green">ACTIVE</Tag>
              </div>
              <div style={{ padding: '10px 14px', borderRadius: 12, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>⚡ Priority Mobile Order Fulfillment</span>
                <Tag color="blue">UNLOCKED</Tag>
              </div>
              <div style={{ padding: '10px 14px', borderRadius: 12, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>📱 Real-time Telegram Receipt &amp; Alerts</span>
                <Tag color={isTelegram ? 'cyan' : 'default'}>{isTelegram ? 'CONNECTED' : 'DISCONNECTED'}</Tag>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card style={{ borderRadius: 18, border: '1px solid #e2e8f0' }} title={<div style={{ fontSize: 15, fontWeight: 700 }}>⚙️ Account Actions</div>}>
            <Space direction="vertical" style={{ width: '100%' }} size={10}>
              <Button block style={{ borderRadius: 10, height: 42 }} onClick={() => navigate('/shop/sbc-store')}>
                Browse Storefront &amp; Order
              </Button>
              <Button block style={{ borderRadius: 10, height: 42 }} onClick={() => navigate('/admins/dashboard')}>
                Admin ERP Workspace
              </Button>
              <Button danger block style={{ borderRadius: 10, height: 42 }} onClick={handleLogout}>
                Sign Out from Aura Global
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
